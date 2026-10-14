// api.js

// Утилита задержки на базе Promise
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Мок-функция сетевого запроса с эмуляцией сбоев
export async function mockFetchUser(userId, { shouldFail = false, delayMs = 500 } = {}) {
  await delay(delayMs);

  if (shouldFail) {
    throw new Error(`[500 Server Error] Не удалось загрузить пользователя ID: ${userId}`);
  }

  return {
    id: userId,
    name: `Пользователь ${userId}`,
    role: userId === 'u1' ? 'admin' : 'developer',
    loadedAt: new Date().toLocaleTimeString(),
  };
}

// Асинхронная операция с поддержкой отмены по AbortSignal
export async function fetchDataWithCancel(url, { signal } = {}) {
  // Проверяем, не был ли сигнал уже отменён до старта
  if (signal?.aborted) {
    throw new DOMException('Операция отменена до старта', 'AbortError');
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      resolve({ data: `Ответ для ${url}`, timestamp: Date.now() });
    }, 1500);

    // Подписываемся на событие отмены
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Запрос отменён пользователем', 'AbortError'));
    });
  });
}

export default mockFetchUser;
