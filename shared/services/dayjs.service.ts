import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/pt";

dayjs.extend(customParseFormat);
dayjs.locale("pt");

export { Dayjs };
export default dayjs;
