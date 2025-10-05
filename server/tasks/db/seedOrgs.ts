import { nanoid } from "nanoid";
import { createId } from "@paralleldrive/cuid2";
import { parse } from "csv-parse";
import { createReadStream } from "fs";
import { resolve as resolvePath, dirname } from "path";
import { fileURLToPath } from "url";

import { eq, useDrizzle } from "server/database";
import { organizations } from "server/database/dbSchemas/organizations.db.schema";
import { contacts } from "server/database/dbSchemas/contacts.db.schema";
import type { Organization } from "shared/types/organization";
import type { Contact } from "shared/types/contact";

import distritos from "public/assets/distritos.json";
import localidades from "public/assets/localidades.json";
import municipios from "public/assets/municipios.json";

const parseFile = async (filename: string): Promise<{ contacts: Contact[]; orgs: Organization[] }> => {
  const regex = /^\d{4}\s*-\d{3}$/;

  return new Promise((resolve, reject) => {
    const orgs: Organization[] = [];
    const contacts: Contact[] = [];

    const parser = parse({ columns: true, skip_empty_lines: true, trim: true });

    parser.on("readable", () => {
      let record: any;
      while ((record = parser.read()) !== null) {
        // console.log(record);
        const id = createId();
        let district = "";
        let postalCode = "";
        let address = "";
        let city = "";

        record.MORADA.split(" ").forEach((bit: string) => {
          const normalized = bit.toLowerCase().replaceAll(".", "").replaceAll(",", "").replaceAll("º", "").trim();

          if (!normalized || normalized.includes("portugal")) {
            return;
          }

          let c = municipios.find((m) => m.toLowerCase().includes(normalized));
          if (c) {
            city = c;
          } else {
            c = localidades.find((l) => l.toLowerCase().includes(normalized));
          }

          const d = distritos.find((d) => normalized.includes(d.toLowerCase()));
          if (d) {
            district = d;
            return;
          }

          if (regex.test(normalized)) {
            postalCode = normalized.replaceAll(" ", "");
            return;
          }

          address += `${bit.replaceAll(".", "").replaceAll(",", "").replaceAll("º", "").trim()} `;
        });

        orgs.push({
          id,
          name: record.NOME.trim(),
          normalizedName: sanitizeInput(record.NOME),
          category: "other",
          slug: `${record.NOME.split(" ")[0].trim().toLowerCase()}-${nanoid()}`,
          verified: true,
          district: district || undefined,
          postalCode: postalCode || undefined,
          address: address.trim() || undefined,
          city: city || undefined,
          ...(record.SITE && { website: record.SITE.trim() }),
        });

        if (record.TELEFONE) {
          contacts.push({
            id: createId(),
            entityId: id,
            entityType: "organization",
            contact: record.TELEFONE.trim(),
            type: "phone",
          } as Contact);
        }
        if (record.EMAIL) {
          contacts.push({
            id: createId(),
            entityId: id,
            entityType: "organization",
            contact: record.EMAIL.trim(),
            type: "email",
          } as Contact);
        }
      }
    });

    parser.on("error", reject);

    parser.on("end", () => resolve({ orgs, contacts }));

    // Parse the CSV fie
    createReadStream(resolvePath(dirname(fileURLToPath(import.meta.url)), "../../server/tasks/db", filename)).pipe(
      parser,
    );
  });
};

export default defineTask({
  meta: {
    name: "db:seedOrgs",
    description: "Run database seed orgs task",
  },
  async run() {
    console.log("[>] Running DB seed orgs task...");

    const db = useDrizzle();

    console.log("[>] Getting..");

    const data = await parseFile("./info.csv");

    // @ts-ignore
    db.batch(data.orgs.map((o) => db.insert(organizations).values(o)));
    // @ts-ignore
    db.batch(data.contacts.map((c) => db.insert(contacts).values(c)));
    // db.batch([
    //   // data.orgs.map((o) => db.insert(organizations).values(o)),
    //   ...data.contacts.map((c) => db.insert(contacts).values({})),
    // ]);

    // await Promise.all([db.insert(organizations).values(data.orgs), db.insert(contacts).values(data.contacts)]);

    console.log("[>] DB seed task finished successfully");
    return { result: "success" };
  },
});
