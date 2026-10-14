// mathUtils.js

// Каррирование: validateRange(min, max)(value)
export const validateRange = (min, max) => (value) => {
  return value >= min && value <= max
    ? { valid: true }
    : { valid: false, error: `Число должно быть в диапазоне от ${min} до ${max}` };
};

// Каррирование: validateMinLength(min)(value)
export const validateMinLength = (min) => (value) => {
  return typeof value === 'string' && value.length >= min
    ? { valid: true }
    : { valid: false, error: `Минимальная длина — ${min} символов` };
};

// Специализированные валидаторы
export const isPasswordSecure = validateMinLength(8);
export const isAgeValid = validateRange(18, 65);

// Пример использования:
// isPasswordSecure('qwerty123') -> { valid: true }
// isAgeValid(15)                -> { valid: false, error: '...' }
