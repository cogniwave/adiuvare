import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/pt";

export { Dayjs } from "dayjs";

dayjs.extend(customParseFormat);
dayjs.locale("pt");

export default dayjs;
