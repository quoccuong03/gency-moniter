import {
  isBlank,
  isEmail,
  isNumeric,
  checkMinNumber,
  checkMaxNumber,
  checkMinLength,
  checkMaxLength,
  isPhoneNumber, 
} from './common'

class Validator {
  static init(rules) {
    this._rules = rules
    this._data = {
      isValid: true
    }

    for (let field in rules) {
      this._data[field] = {
        value: '',
        message: null
      }
    }

    return this._data
  }
  
  static update(field, value) {
    const rules = this._rules[field]

    if (rules) {
      if (typeof value === 'string') {
        value = value.trim()
      }

      for (let rule of rules) {
        this._data[field].value = value

        if (
          (rule.phone && !isPhoneNumber(value)) ||
          (rule.required && isBlank(value)) ||
          (rule.number && !isNumeric(value)) ||
          (rule.email && !isEmail(value)) ||
          (rule.min && !checkMinNumber(value, rule.min)) ||
          (rule.max && !checkMaxNumber(value, rule.max)) ||
          (rule.minLength && !checkMinLength(value, rule.minLength)) ||
          (rule.maxLength && !checkMaxLength(value, rule.maxLength))
        ) {
          this._data.isValid = false
          this._data[field].message = rule.message
          break
        }
        else {
          this._data[field].message = null
        }
      }
    }

    return this._data
  }

  static test(data) {
    this._data.isValid = true

    for (let field in data) {
      this._data = Validator.update(field, data[field])
    }

    return this._data
  }
}

export default Validator