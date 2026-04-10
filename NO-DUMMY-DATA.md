# ✅ No Dummy Data Policy

Website Watchify menerapkan kebijakan **ANTI DUMMY DATA** - semua data yang ditampilkan harus real dari API.

## Perubahan yang Dilakukan

### 1. Hero Carousel
**Before:**
```tsx
{film.synopsis || "Sebuah drama fantasi romantis yang menakjubkan..."}
```

**After:**
```tsx
{film.synopsis && (
  <Typography>{film.synopsis}</Typography>
)}
```

- ❌ Removed: Fallback dummy synopsis text
- ✅ Now: Hanya tampil jika ada data real dari API
- ✅ Conditional rendering untuk synopsis dan genre pills

### 2. Film Metadata
**Before:**
```tsx
<span>{film.release_date ? new Date(film.release_date).getFullYear() : '2024'}</span>
```

**After:**
```tsx
<span>{film.release_date ? new Date(film.release_date).getFullYear() : new Date().getFullYear()}</span>
```

- ❌ Removed: Hardcoded year '2024'
- ✅ Now: Menggunakan tahun sekarang jika data kosong

### 3. Badges
**Before:**
```tsx
<span>TOP 1</span>
<span>High Popularity</span>
<span>Original</span>
```

**After:**
```tsx
{film.average_rating >= 8.0 && <span>TOP RATED</span>}
{film.airing_status === 'airing' && <span>Sedang Tayang</span>}
{film.airing_status === 'finished' && <span>Completed</span>}
```

- ❌ Removed: Static dummy badges
- ✅ Now: Dynamic badges berdasarkan data real

## Rules untuk Developer

### ✅ DO:
1. Gunakan conditional rendering untuk data optional
2. Tampilkan empty state yang jelas jika tidak ada data
3. Gunakan data real dari API
4. Handle loading dan error states dengan baik

### ❌ DON'T:
1. Jangan gunakan fallback text dummy
2. Jangan hardcode data yang seharusnya dynamic
3. Jangan tampilkan placeholder text di production
4. Jangan gunakan "Lorem ipsum" atau text sample

## Empty States yang Diperbolehkan

Empty states yang informatif DIPERBOLEHKAN:

```tsx
// ✅ GOOD - Informative empty state
{films.length === 0 && (
  <div className="text-center py-12">
    <p>Belum ada film dalam daftar</p>
  </div>
)}

// ❌ BAD - Dummy data as fallback
{film.title || "Film Tanpa Judul"}
```

## Conditional Rendering Pattern

### Synopsis
```tsx
{film.synopsis && (
  <Typography>{film.synopsis}</Typography>
)}
```

### Rating
```tsx
{film.average_rating > 0 && (
  <div className="flex items-center gap-1">
    <Star className="w-4 h-4" />
    <span>{film.average_rating.toFixed(1)}</span>
  </div>
)}
```

### Genres
```tsx
{film.genres && film.genres.length > 0 && (
  <div className="flex gap-2">
    {film.genres.map(genre => (
      <span key={genre.id}>{genre.name}</span>
    ))}
  </div>
)}
```

### Episodes
```tsx
{film.total_episodes > 0 && (
  <span>{film.total_episodes} Episodes</span>
)}
```

## Form Placeholders

Placeholder di form input DIPERBOLEHKAN karena bukan data yang ditampilkan:

```tsx
// ✅ OK - Form placeholder
<input placeholder="Masukkan judul film..." />

// ✅ OK - Search placeholder  
<input placeholder="Cari film..." />
```

## Testing

Saat testing, pastikan:
1. ✅ Tidak ada text dummy yang muncul
2. ✅ Empty states tampil dengan benar
3. ✅ Loading states berfungsi
4. ✅ Error handling proper
5. ✅ Conditional rendering bekerja

## Checklist

- [x] Hero carousel - No dummy synopsis
- [x] Hero carousel - Dynamic badges
- [x] Hero carousel - Conditional genre pills
- [x] Hero carousel - Real metadata
- [x] Film cards - Real data only
- [x] Empty states - Informative messages
- [ ] Chart components - Not used in production
- [ ] Form placeholders - Allowed

## Impact

**Before:**
- User melihat text dummy yang tidak relevan
- Data terlihat fake/tidak profesional
- Confusing untuk user

**After:**
- Hanya data real yang ditampilkan
- Professional appearance
- Clear empty states
- Better UX

## Maintenance

Saat menambah fitur baru:
1. Jangan gunakan fallback dummy data
2. Implement proper conditional rendering
3. Add informative empty states
4. Test dengan data kosong
5. Test dengan data lengkap
