'use client';

import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import { useFilmDetail, formatDateForApi } from '@/lib/hooks/useFilms';
import { useGenres } from '@/lib/hooks/useGenres';
import { toast } from 'sonner';
import { DropzoneUploader } from '@/components/dropzone-uploader';

export default function EditFilmPage() {
  const router = useRouter();
  const params = useParams();
  const filmId = params?.id as string;
  
  const { data: filmData, isLoading: isLoadingFilm } = useFilmDetail(filmId);
  const { data: genresData } = useGenres();
  // const { mutate: updateFilm, isPending } = useUpdateFilm();
  const isPending = false;
  
  const { register, handleSubmit, reset } = useForm();
  
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (filmData?.data) {
      const film = filmData.data;
      
      let formattedDate = "";
      if (film.release_date) {
        // Output to datetime-local expected format: YYYY-MM-DDTHH:MM
        const d = new Date(film.release_date);
        formattedDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      }

      reset({
        title: film.title,
        total_episodes: film.total_episodes,
        airing_status: film.airing_status,
        synopsis: film.synopsis,
        release_date: formattedDate
      });
      
      if (film.genres) {
        setSelectedGenres(film.genres.map((g: any) => g.id));
      }
    }
  }, [filmData, reset]);

  const toggleGenre = (id: string) => {
    if (selectedGenres.includes(id)) {
      setSelectedGenres(selectedGenres.filter(g => g !== id));
    } else {
      setSelectedGenres([...selectedGenres, id]);
    }
  };

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('synopsis', data.synopsis);
    formData.append('airing_status', data.airing_status);
    formData.append('total_episodes', data.total_episodes);
    
    if (data.release_date) {
      formData.append('release_date', formatDateForApi(data.release_date));
    }
    
    if (selectedGenres.length > 0) {
      formData.append('genres', selectedGenres.join(','));
    }
    
    if (files.length > 0) {
      for (const file of files) {
        formData.append('images', file);
      }
    }

    // updateFilm({ id: filmId, formData }, {
    //   onSuccess: () => {
    //     toast.success('Berhasil mengubah Film!');
    //     router.push('/dashboard/films');
    //   },
    //   onError: (err: any) => {
    //     toast.error(err.response?.data?.message || 'Gagal mengubah film');
    //   }
    // });
  };

  if (isLoadingFilm) {
    return (
      <div className="flex-1 w-full bg-[#0b0c0f] font-sans text-white p-4 sm:p-6 flex items-center justify-center min-h-full">
         <div className="w-8 h-8 border-2 border-[#00dc74] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-[#0b0c0f] font-sans text-white p-4 sm:p-6 lg:p-8 min-h-full">
      <div className="max-w-4xl mx-auto pb-12">
        <div className="mb-8">
          <Link href="/dashboard/films" className="inline-flex items-center gap-2 text-sm font-bold text-neutral-400 hover:text-[#00dc74] mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Batal & Kembali
          </Link>
          <h1 className="text-3xl font-bold">Edit Film: {filmData?.data?.title}</h1>
        </div>

        <div className="bg-[#1b1c21] border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-neutral-300 mb-2">Judul Tayangan</label>
                <input {...register('title', {required: true})} className="w-full bg-[#0b0c0f] border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-[#00dc74] outline-none" placeholder="Masukkan judul..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-300 mb-2">Total Episode</label>
                <input type="number" {...register('total_episodes')} className="w-full bg-[#0b0c0f] border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-[#00dc74] outline-none" placeholder="12" />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-300 mb-2">Status Tayang</label>
                <select {...register('airing_status')} className="w-full bg-[#0b0c0f] border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-[#00dc74] outline-none text-white">
                  <option value="not_yet_aired">Akan Datang (Belum Tayang)</option>
                  <option value="airing">Sedang Tayang (Ongoing)</option>
                  <option value="finished_airing">Selesai (Tamat)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-300 mb-2">Tanggal Rilis</label>
                <input type="datetime-local" step="1" {...register('release_date')} className="w-full bg-[#0b0c0f] border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-[#00dc74] outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-300 mb-2">Sinopsis</label>
              <textarea {...register('synopsis')} rows={4} className="w-full bg-[#0b0c0f] border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-[#00dc74] outline-none" placeholder="Ceritakan alur cerita singkat..."></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-300 mb-2">Pilih Kategori (Genre)</label>
              <div className="flex flex-wrap gap-2">
                {genresData?.data?.map((genre: any) => (
                  <button type="button" key={genre.id} onClick={() => toggleGenre(genre.id)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${selectedGenres.includes(genre.id) ? 'bg-[#00dc74] border-[#00dc74] text-black shadow-[0_0_10px_rgba(0,220,116,0.3)]' : 'bg-[#0b0c0f] border-white/10 text-neutral-400 hover:border-[#00dc74]/50'}`}>
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-300 mb-2">Poster Tayangan</label>
              <DropzoneUploader
                onChange={setFiles}
                existingImages={filmData?.data?.images || []}
              />
              <p className="mt-2 text-xs text-neutral-500">Kosongkan jika tidak ingin mengganti poster yang ada.</p>
            </div>

            <div className="pt-6 border-t border-white/5 flex gap-4">
              <button disabled={isPending} type="submit" className="flex-1 bg-[#00dc74] text-black font-bold py-3.5 rounded-lg hover:bg-[#00c266] transition-all flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(0,220,116,0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
                <Save className="w-5 h-5" /> {isPending ? 'Menyimpan Perubahan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
