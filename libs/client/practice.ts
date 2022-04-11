import { useState } from "react";
// state의 타입을 지정
interface StateType<T> {
  loading: boolean;
  error?: object;
  data?: T;
}
type UseMutationType<T> = [(data: T) => void, StateType<T>];
// 이 훅은 fetch함수와 response data, loading, error를 반환한다.
export default function useMutation<T = any>(url: string): UseMutationType<T> {
  const [state, setState] = useState<StateType<T>>({
    loading: false,
    error: undefined,
    data: undefined, // api 서버에서 응답된 데이터.
  });
  function mutation(data: T) {
    setState((prev) => ({ ...prev, loading: true }));
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json().catch(() => {}))
      .then((data) => setState((prev) => ({ ...prev, data })))
      .catch((error) => setState((prev) => ({ ...prev, error })))
      .finally(() => setState((prev) => ({ ...prev, loading: false })));
  }
  return [mutation, { ...state }];
}
