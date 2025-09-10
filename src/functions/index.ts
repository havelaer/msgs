import { DefaultFunctions, DraftFunctions, type MessageFunction } from "messageformat/functions";

const {
  currency,
  date,
  datetime,
  percent,
  time,
  unit,
}: {
  currency: MessageFunction<any, any>;
  date: MessageFunction<any, any>;
  datetime: MessageFunction<any, any>;
  percent: MessageFunction<any, any>;
  time: MessageFunction<any, any>;
  unit: MessageFunction<any, any>;
} = DraftFunctions;

const {
  integer,
  number,
  offset,
  string,
}: {
  integer: MessageFunction<any, any>;
  number: MessageFunction<any, any>;
  offset: MessageFunction<any, any>;
  string: MessageFunction<any, any>;
} = DefaultFunctions;

export { currency, date, datetime, percent, number, time, unit, integer, offset, string };
