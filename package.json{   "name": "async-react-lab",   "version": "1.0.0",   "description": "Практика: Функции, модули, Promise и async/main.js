// main.js
import { mockFetchUser, fetchDataWithCancel } from './api.js';
import { isPasswordSecure, isAgeValid } from './mathUtils.js';

// ============================================================
// СЦЕНАРИЙ 1: Отказоустойчивая загрузка виджетов через Promise.allSettled
// ============================================================
async function loadDashboardWidgets() {
  const userIds = ['u1', 'u2_failed', 'u3'];

  const requests = userIds.map((id) =>
    mockFetchUser(id, { shouldFail: id.includes('failed') })
  );

  const results = await Promise.allSettled(requests);

  const successfulUsers = [];
  const failedErrors = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      successfulUsers.push(result.value);
    } else {
      failedErrors.push({
        id: userIds[index],
        reason: result.reason.message,
      });
    }
  });

  console.log('✅ Успешно загружены:', successfulUsers);
  console.log('❌ Ошибки загрузки виджетов:', failedErrors);
}

// ============================================================
// СЦЕНАРИЙ 2: Демонстрация каррирования
// ============================================================
function demoCurrying() {
  console.log('\n--- Каррирование ---');
  console.log('Пароль "qwerty123":', isPasswordSecure('qwerty123'));
  console.log('Пароль "123":', isPasswordSecure('123'));
  console.log('Возраст 25:', isAgeValid(25));
  console.log('Возраст 15:', isAgeValid(15));
}

// ============================================================
// СЦЕНАРИЙ 3: Отмена запроса через AbortController
// ============================================================
async function demoAbort() {
  console.log('\n--- AbortController ---');
  const controller = new AbortController();

  // Отменяем через 300 мс (запрос длится 1500 мс)
  setTimeout(() => controller.abort(), 300);

  try {
    const result = await fetchDataWithCancel('/api/users', { signal: controller.signal });
    console.log('Результат:', result);
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('⚠️  Запрос отменён корректно:', err.message);
    } else {
      console.error('Неожиданная ошибка:', err);
    }
  }
}

// ============================================================
// Запуск
// ============================================================
await loadDashboardWidgets();
demoCurrying();
await demoAbort();
