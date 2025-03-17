import { useNavigate } from "react-router";

export function useCustomNavigate() {
  const navigate = useNavigate();

  function handleNavigate(path: string) {
    if (!path) return;
    navigate(path);
  }

  return { navigate: handleNavigate };
}
