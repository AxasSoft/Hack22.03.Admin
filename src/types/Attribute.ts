interface Attribute {
  id: number
  name: string | null
  optional: boolean | null
  categoryId: number | null
  productId: number | null
  rangeFrom: number | null
  rangeTo: number | null
  options: [string] | null
  attributeType: string | null
  value: number | string | boolean | null
}

interface AttributeValue {
  id: number
  attribute: Attribute
  value: string | number | boolean | null
}

interface NewAttribute {
  id: number
  name: string | null
  optional: boolean
  type: string | null
  value: string | null
}

export type { Attribute, AttributeValue, NewAttribute }
