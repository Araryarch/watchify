'use client';

import Link from 'next/link';
import { ArrowLeft, Save, CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCreateFilm, formatDateForApi } from '@/lib/hooks/useFilms';
import { useGenres } from '@/lib/hooks/useGenres';
import { DropzoneUploader } from '@/components/dropzone-uploader';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function CreateFilmPage() {
  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm();
  const { mutate: createFilm, isPending } = useCreateFilm();
  const { data: genresData } = useGenres();
  
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [releaseDate, setReleaseDate] = useState<Date>();

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
    if (releaseDate) {
      formData.append('release_date', formatDateForApi(releaseDate.toISOString()));
    }
    
    if (selectedGenres.length > 0) {
      formData.append('genres', selectedGenres.join(','));
    }
    
    if (files.length > 0) {
      for (const file of files) {
        formData.append('images', file);
      }
    }

    createFilm(formData, {
      onSuccess: () => {
        toast.success('Berhasil membuat Film!');
        router.push('/dashboard/admin/films');
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Gagal menambahkan film');
      }
    });
  };

  return (
    <div className="flex-1 w-full bg-[#0b0c0f] font-sans text-white p-4 sm:p-6 lg:p-8 min-h-full">
      <div className="max-w-4xl mx-auto pb-12">
        <div className="mb-8">
          <Link href="/dashboard/admin/films" className="inline-flex items-center gap-2 text-sm font-bold text-neutral-400 hover:text-primary mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
          <h1 className="text-3xl font-bold">Tambah Film Baru</h1>
        </div>

        <div className="bg-[#1b1c21] border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-neutral-300 mb-2">Judul Tayangan</label>
                <input {...register('title', {required: true})} className="w-full bg-[#0b0c0f] border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary outline-none" placeholder="Masukkan judul..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-300 mb-2">Total Episode</label>
                <input type="number" {...register('total_episodes')} className="w-full bg-[#0b0c0f] border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary outline-none" placeholder="12" />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-300 mb-2">Status Tayang</label>
                <select {...register('airing_status')} className="w-full bg-[#0b0c0f] border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary outline-none text-white">
                  <option value="not_yet_aired">Akan Datang (Belum Tayang)</option>
                  <option value="airing">Sedang Tayang (Ongoing)</option>
                  <option value="finished_airing">Selesai (Tamat)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-300 mb-2">Tanggal Rilis</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-[#0b0c0f] border-white/10 hover:bg-[#0b0c0f] hover:border-primary text-white"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {releaseDate ? format(releaseDate, 'PPP', { locale: id }) : <span>Pilih tanggal</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-[#1b1c21] border-white/10">
                    <Calendar
                      mode="single"
                      selected={releaseDate}
                      onSelect={setReleaseDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-300 mb-2">Sinopsis</label>
              <textarea {...register('synopsis')} rows={4} className="w-full bg-[#0b0c0f] border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary outline-none" placeholder="Ceritakan alur cerita singkat..."></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-300 mb-2">Pilih Kategori (Genre)</label>
              <div className="flex flex-wrap gap-2">
                {genresData?.data?.map((genre: any) => (
                  <button type="button" key={genre.id} onClick={() => toggleGenre(genre.id)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${selectedGenres.includes(genre.id) ? 'bg-primary border-primary text-black shadow-[0_0_10px_rgba(0,220,116,0.3)]' : 'bg-[#0b0c0f] border-white/10 text-neutral-400 hover:border-primary/50'}`}>
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-300 mb-2">Upload Poster / Banner</label>
              <DropzoneUploader onChange={setFiles} />
            </div>

            <div className="pt-6 border-t border-white/5 flex gap-4">
              <button disabled={isPending} type="submit" className="flex-1 bg-primary text-black font-bold py-3.5 rounded-lg hover:brightness-90 transition-all flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(var(--primary),0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
                <Save className="w-5 h-5" /> {isPending ? 'Menyimpan...' : 'Simpan Film'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
