import api from '../api';

export async function fetchReviews(type: 'hotel' | 'yacht', reviewable_id: number) {
  const res = await api.get('/reviews', { params: { type, reviewable_id } });
  return res.data.data;
}

export async function addReview(data: any) {
  const res = await api.post('/reviews', data);
  return res.data.data;
}