import { ref } from 'vue'

const moneyMask = (value: number) => {
  if (value != 0) {
    value = Math.floor(value / 100)
  } else {
    return '0'
  }

  const strValue = value
    .toString()
    .replace('.', '')
    .replace(',', '')
    .replace(/\D/g, '')

  const options = { minimumFractionDigits: 0 }
  const result = new Intl.NumberFormat('ru-RU', options).format(
    parseFloat(strValue),
  )

  return result
}

export default moneyMask
