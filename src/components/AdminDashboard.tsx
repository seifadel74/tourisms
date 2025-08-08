import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { fetchHotels, addHotel, updateHotel, deleteHotel } from '../api/hotel';
import { fetchYachts, addYacht, updateYacht, deleteYacht } from '../api/yacht';
import { fetchBookings, updateBooking, deleteBooking } from '../api/booking';
import { fetchUsers, updateUser, deleteUser } from '../api/user';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AdminTable } from './AdminTable';
import { AdminFormModal } from './AdminFormModal';
import './AdminDashboard.css';

// Define types for our data structures
interface Hotel {
  id: number;
  name: string;
  city: string;
  price: number; // Unified price field for frontend forms
  price_per_night?: number; // Optional, for backend compatibility
  rating: number;
  images?: string[];
  description?: string;
  location?: string;
  amenities?: string[];
}

interface Yacht {
  id: number;
  name: string;
  location: string;
  price: number; // Unified price field for frontend forms
  price_per_day?: number; // Optional, for backend compatibility
  capacity: number;
  rating?: number;
  images?: string[];
  description?: string;
  amenities?: string[];
}

type BookingStatus = 'مؤكد' | 'معلق' | 'ملغي';

interface Booking {
  id: number;
  user: { name: string };
  bookable: { name: string };
  check_in_date: string;
  check_out_date: string;
  status: BookingStatus;
}

type UserRole = 'admin' | 'user';

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, lastPage, onPageChange }: PaginationProps) {
  if (lastPage <= 1) return null;

  const pages = Array.from({ length: lastPage }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        السابق
      </button>
      {pages.map(page => (
        <button
          key={page}
          className={page === currentPage ? 'active' : ''}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === lastPage}>
        التالي
      </button>
    </div>
  );
}

const TABS = [
  { key: 'hotels', label: 'الفنادق' },
  { key: 'yachts', label: 'اليخوت' },
  { key: 'bookings', label: 'الحجوزات' },
  { key: 'users', label: 'المستخدمين' },
  { key: 'stats', label: 'إحصائيات' },
];

// بيانات افتراضية للعرض في حالة فشل الاتصال بالـ API
const initialHotels: Hotel[] = [
  { id: 1, name: 'فندق البحر الأزرق', city: 'الإسكندرية', price: 1200, rating: 4.5 },
  { id: 2, name: 'فندق الواحة', city: 'القاهرة', price: 1500, rating: 4.8 },
  { id: 3, name: 'فندق النخيل', city: 'شرم الشيخ', price: 2000, rating: 4.9 }
];

const initialYachts: Yacht[] = [
  { id: 1, name: 'يخت الأميرة', location: 'الغردقة', price: 3000, capacity: 10 },
  { id: 2, name: 'يخت البحر الأحمر', location: 'شرم الشيخ', price: 5000, capacity: 15 },
  { id: 3, name: 'يخت الملكي', location: 'الإسكندرية', price: 4000, capacity: 12 }
];

const initialBookings: Booking[] = [
  { id: 1, user: { name: 'أحمد محمد' }, bookable: { name: 'فندق البحر الأزرق' }, check_in_date: '2023-06-15', check_out_date: '2023-06-20', status: 'مؤكد' },
  { id: 2, user: { name: 'سارة أحمد' }, bookable: { name: 'يخت الأميرة' }, check_in_date: '2023-07-10', check_out_date: '2023-07-10', status: 'معلق' },
  { id: 3, user: { name: 'محمد علي' }, bookable: { name: 'فندق الواحة' }, check_in_date: '2023-08-05', check_out_date: '2023-08-10', status: 'مؤكد' }
];

const initialUsers: User[] = [
  { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', role: 'user' },
  { id: 2, name: 'سارة أحمد', email: 'sara@example.com', role: 'user' },
  { id: 3, name: 'محمد علي', email: 'mohamed@example.com', role: 'admin' }
];

export default function AdminDashboard() {
  const [tab, setTab] = useState('hotels');
  return (
    <div className="admin-dashboard">
      <h1>لوحة تحكم الأدمن</h1>
      <div className="admin-tabs">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`admin-tab ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="admin-content">
        {tab === 'hotels' && <HotelsAdmin />}
        {tab === 'yachts' && <YachtsAdmin />}
        {tab === 'bookings' && <BookingsAdmin />}
        {tab === 'users' && <UsersAdmin />}
        {tab === 'stats' && <StatsAdmin />}
      </div>
    </div>
  );
}

function HotelsAdmin() {
  const [hotels, setHotels] = useState<Hotel[]>(initialHotels);
  const [modalOpen, setModalOpen] = useState(false);
  const [editHotel, setEditHotel] = useState<Hotel | null>(null);
  const [form, setForm] = useState({ 
    name: '', 
    city: '', 
    price: '', 
    rating: '', 
    description: '', 
    location: '', 
    amenities: '',
    images: [] as File[]
  });
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const loadHotels = async (page = 1) => {
    setIsLoading(true);
    setError('');
    // دائمًا نبدأ بالبيانات الافتراضية لتجنب واجهة فارغة
    setHotels(initialHotels);
    
    try {
      const response: any = await fetchHotels({ page, search, max_price: filterPrice, sort_by: sortBy });
      
      // معالجة البيانات المحدثة من API
      if (response && response.hotels && Array.isArray(response.hotels)) {
        // Response with pagination
        setHotels(response.hotels);
        setPagination(response.pagination || { current_page: page, last_page: 1, total: response.hotels.length });
      } else if (response && Array.isArray(response)) {
        // Direct array response
        setHotels(response);
        setPagination({ current_page: page, last_page: 1, total: response.length });
      } else {
        // في حالة عدم وجود بيانات صالحة، استخدم البيانات الافتراضية
        console.warn('تم استخدام البيانات الافتراضية للفنادق');
        setError('تعذر تحميل البيانات من الخادم');
      }
    } catch (error: any) {
      console.error('خطأ في تحميل الفنادق:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'فشل تحميل الفنادق';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHotels(currentPage);
  }, [search, filterPrice, sortBy, currentPage]);

  function openAdd() {
    setEditHotel(null);
    setForm({ 
      name: '', 
      city: '', 
      price: '', 
      rating: '', 
      description: '', 
      location: '', 
      amenities: '',
      images: []
    });
    setModalOpen(true);
  }

  function openEdit(hotel: Hotel) {
    setEditHotel(hotel);
    setForm({ 
      name: hotel.name, 
      city: hotel.city, 
      price: String(hotel.price), 
      rating: String(hotel.rating),
      description: hotel.description || '',
      location: hotel.location || hotel.city || '',
      amenities: hotel.amenities ? hotel.amenities.join(', ') : '',
      images: []
    });
    setModalOpen(true);
  }

  async function handleDelete(id: number) {
    if (window.confirm('هل أنت متأكد من حذف الفندق؟')) {
      try {
        await deleteHotel(id);
        setHotels(hotels.filter(h => h.id !== id));
        toast.success('تم حذف الفندق بنجاح');
      } catch (error) {
        toast.error('فشل حذف الفندق');
      }
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.name || !form.city || !form.price || !form.rating) return alert('الحقول الأساسية مطلوبة');
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('city', form.city);
    formData.append('location', form.location || form.city);
    formData.append('price', form.price);
    formData.append('rating', form.rating);
    formData.append('description', form.description);
    
    // Process amenities
    const amenitiesArray = form.amenities.split(',').map(a => a.trim()).filter(a => a);
    formData.append('amenities', JSON.stringify(amenitiesArray));
    
    // Add images
    form.images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });
    
    const hotelData = formData;
    try {
      if (editHotel) {
        const updatedHotel = await updateHotel(editHotel.id, hotelData);
        setHotels(hotels.map(h => h.id === editHotel.id ? updatedHotel : h));
        toast.success('تم تعديل الفندق بنجاح');
      } else {
        const newHotel = await addHotel(hotelData);
        setHotels([...hotels, newHotel]);
        toast.success('تمت إضافة الفندق بنجاح');
      }
      setModalOpen(false);
    } catch (error) {
      toast.error('فشلت العملية');
    }
  }

  const hotelColumns = [
    {
      key: 'image',
      header: 'الصورة',
      render: (hotel: Hotel) => {
        const imageUrl = hotel.images && hotel.images.length > 0 
          ? hotel.images[0] 
          : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=60&fit=crop';
        return (
          <img 
            src={imageUrl} 
            alt={hotel.name} 
            style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=60&fit=crop';
            }}
          />
        );
      }
    },
    { key: 'name', header: 'الاسم' },
    { key: 'city', header: 'المدينة' },
    { 
      key: 'location', 
      header: 'الموقع',
      render: (hotel: Hotel) => hotel.location || hotel.city || 'غير محدد'
    },
    { 
      key: 'price', 
      header: 'السعر',
      render: (hotel: Hotel) => {
        const price = hotel.price_per_night || hotel.price || 0;
        return price > 0 ? `${price} ج.م/ليلة` : 'غير محدد';
      }
    },
    { 
      key: 'rating', 
      header: 'التقييم',
      render: (hotel: Hotel) => {
        const rating = hotel.rating || 0;
        return rating > 0 ? `${rating}/5` : 'غير مقيم';
      }
    },
    {
      key: 'description',
      header: 'الوصف',
      render: (hotel: Hotel) => {
        const desc = hotel.description || 'لا يوجد وصف';
        return desc.length > 50 ? desc.substring(0, 50) + '...' : desc;
      }
    },
    {
      key: 'amenities',
      header: 'المرافق',
      render: (hotel: Hotel) => {
        if (!hotel.amenities || hotel.amenities.length === 0) return 'لا توجد';
        return hotel.amenities.slice(0, 2).join(', ') + (hotel.amenities.length > 2 ? '...' : '');
      }
    },
  ];

  return (
    <div className="hotels-admin">
      <div className="header">
        <h2>الفنادق</h2>
        <button className="home-buttons-btn" onClick={openAdd}>إضافة فندق جديد</button>
      </div>
      <div className="filters">
        <input
          type="text"
          placeholder="بحث بالاسم أو المدينة"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="">ترتيب حسب</option>
          <option value="price-asc">السعر: من الأقل إلى الأعلى</option>
          <option value="price-desc">السعر: من الأعلى إلى الأقل</option>
          <option value="rating-asc">التقييم: من الأقل إلى الأعلى</option>
          <option value="rating-desc">التقييم: من الأعلى إلى الأقل</option>
        </select>
        <select value={filterPrice} onChange={e => setFilterPrice(e.target.value)}>
          <option value="">كل الأسعار</option>
          <option value="500">حتى 500</option>
          <option value="1000">حتى 1000</option>
          <option value="1500">حتى 1500</option>
        </select>
      </div>
      
      {isLoading && <div className="loading-message">جاري تحميل البيانات...</div>}
      {error && <div className="error-message">{error}</div>}
      
      <AdminTable
        data={hotels || []}
        columns={hotelColumns}
        onEdit={openEdit}
        onDelete={handleDelete}
      />
      <Pagination 
        currentPage={currentPage}
        lastPage={pagination.last_page}
        onPageChange={setCurrentPage}
      />
      
      {hotels.length === 0 && !isLoading && (
        <div className="no-data-message">لا توجد بيانات للعرض</div>
      )}
      <AdminFormModal
        isOpen={modalOpen}
        title={editHotel ? 'تعديل فندق' : 'إضافة فندق جديد'}
        onSubmit={handleSubmit}
        onClose={() => setModalOpen(false)}
        submitButtonText={editHotel ? 'حفظ التعديلات' : 'إضافة'}
      >
        <div style={{ display: 'grid', gap: '16px', maxHeight: '70vh', overflowY: 'auto' }}>
          <input 
            placeholder="اسم الفندق" 
            value={form.name} 
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
            required 
          />
          <input 
            placeholder="المدينة" 
            value={form.city} 
            onChange={e => setForm(f => ({ ...f, city: e.target.value }))} 
            required 
          />
          <input 
            placeholder="الموقع التفصيلي" 
            value={form.location} 
            onChange={e => setForm(f => ({ ...f, location: e.target.value }))} 
          />
          <input 
            placeholder="السعر في الليلة" 
            type="number" 
            value={form.price} 
            onChange={e => setForm(f => ({ ...f, price: e.target.value }))} 
            required 
          />
          <input 
            placeholder="التقييم (من 5)" 
            type="number" 
            step="0.1" 
            min="0" 
            max="5" 
            value={form.rating} 
            onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} 
            required 
          />
          <textarea 
            placeholder="وصف الفندق" 
            value={form.description} 
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
            rows={3}
            style={{ resize: 'vertical', fontFamily: 'inherit' }}
          />
          <input 
            placeholder="المرافق (مفصولة بفاصلة)" 
            value={form.amenities} 
            onChange={e => setForm(f => ({ ...f, amenities: e.target.value }))} 
          />
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              صور الفندق:
            </label>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setForm(f => ({ ...f, images: files }));
              }}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            {form.images.length > 0 && (
              <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
                تم اختيار {form.images.length} صورة
              </div>
            )}
          </div>
        </div>
      </AdminFormModal>
    </div>
  );
}

function YachtsAdmin() {
  const [yachts, setYachts] = useState<Yacht[]>(initialYachts);
  const [modalOpen, setModalOpen] = useState(false);
  const [editYacht, setEditYacht] = useState<Yacht | null>(null);
  const [form, setForm] = useState({ 
    name: '', 
    location: '', 
    price: '', 
    capacity: '', 
    description: '', 
    amenities: '',
    images: [] as File[]
  });
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const loadYachts = async (page = 1) => {
    setIsLoading(true);
    setError('');
    // دائمًا نبدأ بالبيانات الافتراضية لتجنب واجهة فارغة
    setYachts(initialYachts);
    
    try {
      const response: any = await fetchYachts({ page, search, max_price: filterPrice, sort_by: sortBy });
      
      // معالجة البيانات المحدثة من API
      if (response && response.yachts && Array.isArray(response.yachts)) {
        // Response with pagination
        setYachts(response.yachts);
        setPagination(response.pagination || { current_page: page, last_page: 1, total: response.yachts.length });
      } else if (response && Array.isArray(response)) {
        // Direct array response
        setYachts(response);
        setPagination({ current_page: page, last_page: 1, total: response.length });
      } else {
        // في حالة عدم وجود بيانات صالحة، استخدم البيانات الافتراضية
        console.warn('تم استخدام البيانات الافتراضية لليخوت');
        setError('تعذر تحميل البيانات من الخادم');
      }
    } catch (error: any) {
      console.error('خطأ في تحميل اليخوت:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'فشل تحميل اليخوت';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadYachts(currentPage);
  }, [search, filterPrice, sortBy, currentPage]);

  function openAdd() {
    setEditYacht(null);
    setForm({ 
      name: '', 
      location: '', 
      price: '', 
      capacity: '', 
      description: '', 
      amenities: '',
      images: []
    });
    setModalOpen(true);
  }
  function openEdit(yacht: Yacht) {
    setEditYacht(yacht);
    setForm({ 
      name: yacht.name, 
      location: yacht.location, 
      price: String(yacht.price), 
      capacity: String(yacht.capacity),
      description: yacht.description || '',
      amenities: yacht.amenities ? yacht.amenities.join(', ') : '',
      images: []
    });
    setModalOpen(true);
  }
  async function handleDelete(id: number) {
    if (window.confirm('هل أنت متأكد من حذف اليخت؟')) {
      try {
        await deleteYacht(id);
        setYachts(yachts.filter(y => y.id !== id));
        toast.success('تم حذف اليخت بنجاح');
      } catch (error) {
        toast.error('فشل حذف اليخت');
      }
    }
  }
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.name || !form.location || !form.price || !form.capacity) return alert('كل الحقول مطلوبة');
    const yachtData = { 
      name: form.name,
      location: form.location,
      price: Number(form.price), // Send as 'price' to addYacht/updateYacht
      capacity: Number(form.capacity) 
    };
    try {
      if (editYacht) {
        const updatedYacht = await updateYacht(editYacht.id, yachtData);
        setYachts(yachts.map(y => y.id === editYacht.id ? updatedYacht : y));
        toast.success('تم تعديل اليخت بنجاح');
      } else {
        const newYacht = await addYacht(yachtData);
        setYachts([...yachts, newYacht]);
        toast.success('تمت إضافة اليخت بنجاح');
      }
      setModalOpen(false);
    } catch (error) {
      toast.error('فشلت العملية');
    }
  }

  const yachtColumns = [
    {
      key: 'image',
      header: 'الصورة',
      render: (yacht: Yacht) => {
        const imageUrl = yacht.images && yacht.images.length > 0 
          ? yacht.images[0] 
          : 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&h=60&fit=crop';
        return (
          <img 
            src={imageUrl} 
            alt={yacht.name} 
            style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&h=60&fit=crop';
            }}
          />
        );
      }
    },
    { key: 'name', header: 'الاسم' },
    { key: 'location', header: 'الموقع' },
    { 
      key: 'price', 
      header: 'السعر',
      render: (yacht: Yacht) => {
        const price = yacht.price_per_day || yacht.price || 0;
        return price > 0 ? `${price} ج.م/يوم` : 'غير محدد';
      }
    },
    { 
      key: 'capacity', 
      header: 'السعة',
      render: (yacht: Yacht) => {
        const capacity = yacht.capacity || 0;
        return capacity > 0 ? `${capacity} شخص` : 'غير محدد';
      }
    },
    {
      key: 'description',
      header: 'الوصف',
      render: (yacht: Yacht) => {
        const desc = yacht.description || 'لا يوجد وصف';
        return desc.length > 50 ? desc.substring(0, 50) + '...' : desc;
      }
    },
    {
      key: 'amenities',
      header: 'المرافق',
      render: (yacht: Yacht) => {
        if (!yacht.amenities || yacht.amenities.length === 0) return 'لا توجد';
        return yacht.amenities.slice(0, 2).join(', ') + (yacht.amenities.length > 2 ? '...' : '');
      }
    },
  ];

  return (
    <div className="yachts-admin">
      <div className="header">
        <h2>اليخوت</h2>
        <button className="home-buttons-btn" onClick={openAdd}>إضافة يخت جديد</button>
      </div>
      <div className="filters">
        <input
          type="text"
          placeholder="بحث بالاسم أو الموقع"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="">ترتيب حسب</option>
          <option value="price-asc">السعر: من الأقل إلى الأعلى</option>
          <option value="price-desc">السعر: من الأعلى إلى الأقل</option>
          <option value="capacity-asc">السعة: من الأقل إلى الأعلى</option>
          <option value="capacity-desc">السعة: من الأعلى إلى الأقل</option>
        </select>
        <select value={filterPrice} onChange={e => setFilterPrice(e.target.value)}>
          <option value="">كل الأسعار</option>
          <option value="1000">حتى 1000</option>
          <option value="2000">حتى 2000</option>
          <option value="3000">حتى 3000</option>
        </select>
      </div>
      
      {isLoading && <div className="loading-message">جاري تحميل البيانات...</div>}
      {error && <div className="error-message">{error}</div>}
      
      <AdminTable
        data={yachts || []}
        columns={yachtColumns}
        onEdit={openEdit}
        onDelete={handleDelete}
      />
      <Pagination 
        currentPage={currentPage}
        lastPage={pagination.last_page}
        onPageChange={setCurrentPage}
      />
      
      {yachts.length === 0 && !isLoading && (
        <div className="no-data-message">لا توجد بيانات للعرض</div>
      )}
      <AdminFormModal
        isOpen={modalOpen}
        title={editYacht ? 'تعديل يخت' : 'إضافة يخت جديد'}
        onSubmit={handleSubmit}
        onClose={() => setModalOpen(false)}
        submitButtonText={editYacht ? 'حفظ التعديلات' : 'إضافة'}
      >
        <input placeholder="اسم اليخت" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        <input placeholder="الموقع" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required />
        <input placeholder="السعر" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
        <input placeholder="السعة" type="number" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} required />
      </AdminFormModal>
    </div>
  );
}

function BookingsAdmin() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [form, setForm] = useState({ status: 'معلق' as BookingStatus });
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const loadBookings = async (page = 1) => {
    setIsLoading(true);
    setError('');
    // دائمًا نبدأ بالبيانات الافتراضية لتجنب واجهة فارغة
    setBookings(initialBookings);
    
    try {
      const response: any = await fetchBookings({ page, search, status: filterStatus });
      // معالجة مختلف أشكال الاستجابة المحتملة
      if (response && response.data && Array.isArray(response.data)) {
        setBookings(response.data);
        setPagination(response.pagination || { current_page: 1, last_page: 1, total: 0 });
      } else if (response && Array.isArray(response)) {
        // في حالة إرجاع مصفوفة مباشرة
        setBookings(response);
        setPagination({ current_page: 1, last_page: 1, total: response.length });
      } else if (response && response.bookings && Array.isArray(response.bookings)) {
        // في حالة إرجاع البيانات في حقل bookings
        setBookings(response.bookings);
        setPagination(response.pagination || { current_page: 1, last_page: 1, total: response.bookings.length });
      } else {
        // في حالة عدم وجود بيانات صالحة، استخدم البيانات الافتراضية
        console.warn('تم استخدام البيانات الافتراضية للحجوزات');
        setError('تعذر تحميل البيانات بالشكل الصحيح');
        // البيانات الافتراضية تم تعيينها بالفعل في بداية الدالة
      }
    } catch (error: any) {
      console.error('خطأ في تحميل الحجوزات:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'فشل تحميل الحجوزات';
      setError(errorMessage);
      toast.error(errorMessage);
      // البيانات الافتراضية تم تعيينها بالفعل في بداية الدالة
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookings(currentPage);
  }, [search, filterStatus, currentPage]);

  function openEdit(booking: Booking) {
    setEditBooking(booking);
    setForm({ status: booking.status });
    setModalOpen(true);
  }

  async function handleDelete(id: number) {
    if (window.confirm('هل أنت متأكد من حذف الحجز؟')) {
      try {
        await deleteBooking(id);
        setBookings(bookings.filter(b => b.id !== id));
        toast.success('تم حذف الحجز بنجاح');
      } catch (error) {
        toast.error('فشل حذف الحجز');
      }
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.status) return alert('الحالة مطلوبة');
    try {
      if (editBooking) {
        const updatedBooking = await updateBooking(editBooking.id, form);
        setBookings(bookings.map(b => b.id === editBooking.id ? updatedBooking : b));
        toast.success('تم تعديل الحجز بنجاح');
      }
      setModalOpen(false);
    } catch (error) {
      toast.error('فشلت العملية');
    }
  }

  const bookingColumns = [
    { key: 'user.name', header: 'العميل' },
    { key: 'bookable.name', header: 'الفندق/اليخت' },
    { key: 'check_in_date', header: 'تاريخ الوصول' },
    { key: 'check_out_date', header: 'تاريخ المغادرة' },
    { key: 'status', header: 'الحالة' },
  ];

  return (
    <div className="bookings-admin">
      <h2>الحجوزات</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="بحث بالعميل أو الفندق أو اليخت"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">كل الحالات</option>
          <option value="مؤكد">مؤكد</option>
          <option value="معلق">معلق</option>
          <option value="ملغي">ملغي</option>
        </select>
      </div>
      
      {isLoading && <div className="loading-message">جاري تحميل البيانات...</div>}
      {error && <div className="error-message">{error}</div>}
      
      <AdminTable
        data={bookings || []}
        columns={bookingColumns}
        onEdit={openEdit}
        onDelete={handleDelete}
      />
      
      {bookings.length === 0 && !isLoading && (
        <div className="no-data-message">لا توجد بيانات للعرض</div>
      )}
      <Pagination 
        currentPage={currentPage}
        lastPage={pagination.last_page}
        onPageChange={setCurrentPage}
      />
      <AdminFormModal
        isOpen={modalOpen}
        title="تعديل الحجز"
        onSubmit={handleSubmit}
        onClose={() => setModalOpen(false)}
        submitButtonText="حفظ التعديلات"
      >
        <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as BookingStatus }))} required>
          <option value="مؤكد">مؤكد</option>
          <option value="معلق">معلق</option>
          <option value="ملغي">ملغي</option>
        </select>
      </AdminFormModal>
    </div>
  );
}

function UsersAdmin() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [editRoleId, setEditRoleId] = useState<number | null>(null);
  const [newRole, setNewRole] = useState<UserRole | ''>('');
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'user' as UserRole, avatar: null as File | null });

  const loadUsers = async (page = 1) => {
    setIsLoading(true);
    setError(null);
    
    // Always start with initialUsers to ensure we have data to display
    setUsers(initialUsers);
    
    try {
      const response: any = await fetchUsers({ page, search, role: filterRole });
      
      // معالجة البيانات المحدثة من API
      if (response && response.users && Array.isArray(response.users)) {
        // Response with pagination
        setUsers(response.users);
        setPagination(response.pagination || { current_page: page, last_page: 1, total: response.users.length });
      } else if (response && Array.isArray(response)) {
        // Direct array response
        setUsers(response);
        setPagination({ current_page: page, last_page: 1, total: response.length });
      } else {
        // في حالة عدم وجود بيانات صالحة، استخدم البيانات الافتراضية
        console.warn('تم استخدام البيانات الافتراضية للمستخدمين');
        setError('تعذر تحميل البيانات من الخادم');
      }
    } catch (error: any) {
      console.error('خطأ في تحميل المستخدمين:', error);
      
      // Extract error message from different possible error structures
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.message || 
        'فشل تحميل المستخدمين';
      
      setError(errorMessage);
      toast.error('فشل تحميل المستخدمين، تم استخدام البيانات الافتراضية');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(currentPage);
  }, [search, filterRole, currentPage]);

  async function handleDelete(id: number) {
    if (window.confirm('هل أنت متأكد من حذف المستخدم؟')) {
      try {
        await deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
        toast.success('تم حذف المستخدم بنجاح');
      } catch (error) {
        toast.error('فشل حذف المستخدم');
      }
    }
  }

  async function handleRoleChange(id: number, role: UserRole) {
    try {
      const updatedUser = await updateUser(id, { role });
      setUsers(users.map(u => u.id === id ? updatedUser : u));
      toast.success('تم تحديث صلاحية المستخدم');
      setEditRoleId(null);
    } catch (error) {
      toast.error('فشل تحديث صلاحية المستخدم');
    }
  }

  function openEdit(user: User) {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: null
    });
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('role', form.role);
      
      if (form.avatar) {
        formData.append('avatar', form.avatar);
      }

      const updatedUser = await updateUser(editingUser.id, formData);
      setUsers(users.map(u => u.id === editingUser.id ? updatedUser.data || updatedUser : u));
      toast.success('تم تحديث بيانات المستخدم بنجاح');
      setModalOpen(false);
      setEditingUser(null);
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || 'فشل تحديث بيانات المستخدم');
    }
  }

  const userColumns = [
    {
      key: 'avatar',
      header: 'الصورة',
      render: (user: User) => {
        // Check if user has uploaded avatar
        if (user.avatar) {
          return (
            <img 
              src={`http://localhost:8000${user.avatar}`}
              alt={user.name}
              className="admin-table-image"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                // Fallback to initials if image fails to load
                const target = e.target as HTMLImageElement;
                const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
                const colorIndex = user.id % colors.length;
                const backgroundColor = colors[colorIndex];
                
                target.style.display = 'none';
                const avatarDiv = document.createElement('div');
                avatarDiv.className = 'user-avatar';
                avatarDiv.style.cssText = `
                  width: 40px;
                  height: 40px;
                  border-radius: 50%;
                  background-color: ${backgroundColor};
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: bold;
                  font-size: 14px;
                `;
                avatarDiv.textContent = initials;
                target.parentNode?.replaceChild(avatarDiv, target);
              }}
            />
          );
        }
        
        // Generate avatar based on user name initials
        const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
        const colorIndex = user.id % colors.length;
        const backgroundColor = colors[colorIndex];
        
        return (
          <div 
            className="user-avatar"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
            title={user.name}
          >
            {initials}
          </div>
        );
      }
    },
    { key: 'name', header: 'الاسم' },
    { key: 'email', header: 'البريد الإلكتروني' },
    { 
      key: 'role', 
      header: 'الصلاحية', 
      render: (u: User) => (
        editRoleId === u.id ? (
          <>
            <select value={newRole} onChange={(e: ChangeEvent<HTMLSelectElement>) => setNewRole(e.target.value as UserRole)}>
              <option value="">اختر الصلاحية</option>
              <option value="admin">أدمن</option>
              <option value="user">مستخدم</option>
            </select>
            <button onClick={() => handleRoleChange(u.id, newRole || u.role)}>حفظ</button>
          </>
        ) : (
          <>
            {u.role === 'admin' ? 'أدمن' : 'مستخدم'} <button onClick={() => { setNewRole(u.role); setEditRoleId(u.id); }}>تغيير</button>
          </>
        )
      )
    },
  ];

  return (
    <div className="users-admin">
      <h2>المستخدمين</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="بحث بالاسم أو البريد الإلكتروني"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)}>
          <option value="">كل الصلاحيات</option>
          <option value="admin">أدمن</option>
          <option value="user">مستخدم</option>
        </select>
      </div>
      
      {isLoading && <div className="loading-message">جاري تحميل البيانات...</div>}
      {error && <div className="error-message">{error}</div>}
      
      <AdminTable
        data={users || []}
        columns={userColumns}
        onEdit={openEdit}
        onDelete={handleDelete}
      />
      <Pagination 
        currentPage={currentPage}
        lastPage={pagination.last_page}
        onPageChange={setCurrentPage}
      />
      
      {users.length === 0 && !isLoading && (
        <div className="no-data-message">لا توجد بيانات للعرض</div>
      )}
      
      <AdminFormModal
        isOpen={modalOpen}
        title="تعديل بيانات المستخدم"
        onSubmit={handleSubmit}
        onClose={() => setModalOpen(false)}
        submitButtonText="حفظ التعديلات"
      >
        <input
          type="text"
          placeholder="الاسم"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          required
        />
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          required
        />
        <select
          value={form.role}
          onChange={e => setForm(f => ({ ...f, role: e.target.value as UserRole }))}
          required
        >
          <option value="user">مستخدم</option>
          <option value="admin">أدمن</option>
        </select>
        <div className="image-upload-section">
          <label>صورة المستخدم:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setForm(f => ({ ...f, avatar: file }));
            }}
          />
          {form.avatar && (
            <div className="image-preview">
              <img 
                src={URL.createObjectURL(form.avatar)} 
                alt="معاينة الصورة" 
                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>
          )}
          {editingUser?.avatar && !form.avatar && (
            <div className="current-image">
              <p>الصورة الحالية:</p>
              <img 
                src={`http://localhost:8000${editingUser.avatar}`} 
                alt="الصورة الحالية" 
                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>
          )}
        </div>
      </AdminFormModal>
    </div>
  );
}


function StatsAdmin() {
  const [stats, setStats] = useState({ hotels: 0, yachts: 0, bookings: 0, users: 0 });
  const [bookingTrends, setBookingTrends] = useState<any[]>([]);
  const [userRoleData, setUserRoleData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllStats = async () => {
      setIsLoading(true);
      setError('');
      try {
        // محاولة جلب البيانات من API
        let hotelsCount = 0;
        let yachtsCount = 0;
        let bookingsCount = 0;
        let usersCount = 0;
        
        try {
          const hotelsResponse: any = await fetchHotels({ limit: 1 });
          if (hotelsResponse && hotelsResponse.pagination && hotelsResponse.pagination.total) {
            hotelsCount = hotelsResponse.pagination.total;
          } else if (hotelsResponse && Array.isArray(hotelsResponse)) {
            hotelsCount = hotelsResponse.length;
          } else if (hotelsResponse && hotelsResponse.hotels && Array.isArray(hotelsResponse.hotels)) {
            hotelsCount = hotelsResponse.hotels.length;
          } else {
            hotelsCount = initialHotels.length;
          }
        } catch (error) {
          console.error('خطأ في جلب إحصائيات الفنادق:', error);
          hotelsCount = initialHotels.length;
        }
        
        try {
          const yachtsResponse: any = await fetchYachts();
          if (yachtsResponse && Array.isArray(yachtsResponse)) {
            yachtsCount = yachtsResponse.length;
          } else if (yachtsResponse && yachtsResponse.yachts && Array.isArray(yachtsResponse.yachts)) {
            yachtsCount = yachtsResponse.yachts.length;
          } else {
            yachtsCount = initialYachts.length;
          }
        } catch (error) {
          console.error('خطأ في جلب إحصائيات اليخوت:', error);
          yachtsCount = initialYachts.length;
        }
        
        try {
          const bookingsResponse: any = await fetchBookings({ limit: 1 });
          if (bookingsResponse && bookingsResponse.total) {
            bookingsCount = bookingsResponse.total;
          } else if (bookingsResponse && Array.isArray(bookingsResponse)) {
            bookingsCount = bookingsResponse.length;
          } else if (bookingsResponse && bookingsResponse.data && Array.isArray(bookingsResponse.data)) {
            bookingsCount = bookingsResponse.data.length;
          } else {
            bookingsCount = initialBookings.length;
          }
        } catch (error) {
          console.error('خطأ في جلب إحصائيات الحجوزات:', error);
          bookingsCount = initialBookings.length;
        }
        
        try {
          const usersResponse: any = await fetchUsers({ limit: 1 });
          if (usersResponse && usersResponse.pagination && usersResponse.pagination.total) {
            usersCount = usersResponse.pagination.total;
          } else if (usersResponse && Array.isArray(usersResponse)) {
            usersCount = usersResponse.length;
          } else if (usersResponse && usersResponse.users && Array.isArray(usersResponse.users)) {
            usersCount = usersResponse.users.length;
          } else {
            usersCount = initialUsers.length;
          }
        } catch (error) {
          console.error('خطأ في جلب إحصائيات المستخدمين:', error);
          usersCount = initialUsers.length;
        }
        
        setStats({ 
          hotels: hotelsCount, 
          yachts: yachtsCount, 
          bookings: bookingsCount, 
          users: usersCount 
        });
        
        // إعداد بيانات اتجاهات الحجوزات
        try {
          const allBookingsResponse: any = await fetchBookings({});
          const monthlyBookings: { [key: string]: number } = {};
          
          let bookingsData = [];
          if (allBookingsResponse && allBookingsResponse.data && Array.isArray(allBookingsResponse.data)) {
            bookingsData = allBookingsResponse.data;
          } else if (allBookingsResponse && Array.isArray(allBookingsResponse)) {
            bookingsData = allBookingsResponse;
          } else {
            bookingsData = initialBookings;
          }
          
          bookingsData.forEach((booking: any) => {
            const date = booking.check_in_date;
            if (date) {
              const month = new Date(date).toLocaleString('default', { month: 'short', year: 'numeric' });
              monthlyBookings[month] = (monthlyBookings[month] || 0) + 1;
            }
          });
          
          setBookingTrends(Object.keys(monthlyBookings).map(month => ({ name: month, bookings: monthlyBookings[month] })));
        } catch (error) {
          console.error('خطأ في جلب اتجاهات الحجوزات:', error);
          // إنشاء بيانات افتراضية للاتجاهات
          setBookingTrends([
            { name: 'يناير 2023', bookings: 5 },
            { name: 'فبراير 2023', bookings: 8 },
            { name: 'مارس 2023', bookings: 12 },
            { name: 'أبريل 2023', bookings: 10 },
            { name: 'مايو 2023', bookings: 15 }
          ]);
        }

        // إعداد بيانات توزيع صلاحيات المستخدمين
        try {
          const allUsersResponse: any = await fetchUsers({});
          const roles: { [key: string]: number } = {};
          
          let usersData = [];
          if (allUsersResponse && allUsersResponse.users && Array.isArray(allUsersResponse.users)) {
            usersData = allUsersResponse.users;
          } else if (allUsersResponse && Array.isArray(allUsersResponse)) {
            usersData = allUsersResponse;
          } else {
            usersData = initialUsers;
          }
          
          usersData.forEach((user: any) => {
            roles[user.role] = (roles[user.role] || 0) + 1;
          });
          
          setUserRoleData(Object.keys(roles).map(role => ({ name: role === 'admin' ? 'أدمن' : 'مستخدم', value: roles[role] })));
        } catch (error) {
          console.error('خطأ في جلب توزيع صلاحيات المستخدمين:', error);
          // إنشاء بيانات افتراضية لتوزيع الصلاحيات
          setUserRoleData([
            { name: 'أدمن', value: 1 },
            { name: 'مستخدم', value: 2 }
          ]);
        }

      } catch (error: any) {
        console.error('خطأ عام في تحميل الإحصائيات:', error);
        const errorMessage = error?.message || 'فشل تحميل الإحصائيات';
        setError(errorMessage);
        toast.error('فشل تحميل الإحصائيات، تم استخدام بيانات افتراضية');
        
        // استخدام بيانات افتراضية في حالة الخطأ
        setStats({ 
          hotels: initialHotels.length, 
          yachts: initialYachts.length, 
          bookings: initialBookings.length, 
          users: initialUsers.length 
        });
        
        setBookingTrends([
          { name: 'يناير 2023', bookings: 5 },
          { name: 'فبراير 2023', bookings: 8 },
          { name: 'مارس 2023', bookings: 12 },
          { name: 'أبريل 2023', bookings: 10 },
          { name: 'مايو 2023', bookings: 15 }
        ]);
        
        setUserRoleData([
          { name: 'أدمن', value: 1 },
          { name: 'مستخدم', value: 2 }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllStats();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="stats-admin">
      <h2>إحصائيات سريعة</h2>
      
      {isLoading && <div className="loading-message">جاري تحميل البيانات...</div>}
      {error && <div className="error-message">{error}</div>}
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.hotels}</div>
          <div>الفنادق</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.yachts}</div>
          <div>اليخوت</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.bookings}</div>
          <div>الحجوزات</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.users}</div>
          <div>المستخدمين</div>
        </div>
      </div>

      <div className="charts-container">
        <h3>اتجاهات الحجوزات</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={bookingTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="bookings" fill="#8884d8" name="عدد الحجوزات" />
          </BarChart>
        </ResponsiveContainer>

        <h3>توزيع صلاحيات المستخدمين</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={userRoleData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
            >
              {userRoleData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}