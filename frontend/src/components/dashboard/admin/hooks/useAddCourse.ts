import { useMutation } from 'react-query';  // Assuming react-query for API calls

export const useAddCourse = () => {
  return useMutation(async (formData: FormData) => {
    const response = await fetch('/api/add-course', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Error adding course');
    return response.json();
  });
};
