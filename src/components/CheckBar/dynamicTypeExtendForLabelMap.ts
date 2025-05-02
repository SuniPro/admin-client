import { WorkMenuListType } from "../../model/workTable";

export type LabelMapType = "WorkMenuLabelMap" | "AnotherLabelMap"; // ✨ 추후 확장 가능

// 2. 각 타입에 매핑되는 데이터 형태
export type LabelMapData<T extends LabelMapType> = T extends "WorkMenuLabelMap"
  ? Record<WorkMenuListType, string>
  : T extends "AnotherLabelMap"
    ? Record<string, string>
    : never;

export type LabelMapKeyType<T extends LabelMapType> =
  T extends "WorkMenuLabelMap" ? WorkMenuListType : string;

export function getLabel<T extends LabelMapType>(
  labelMap: LabelMapData<T>,
  key: T extends "WorkMenuLabelMap" ? WorkMenuListType : string,
): T extends "WorkMenuLabelMap" ? string : string {
  // 타입 단언이 필요하지만, 호출 시점에서 타입 안전성 보장
  // eslint-disable-next-line
  return labelMap[key as keyof typeof labelMap] as any;
}
