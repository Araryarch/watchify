'use client';

import { useThemeStore, themes, type Theme } from '@/lib/store/themeStore';
import { Button } from '@/components/ui/button';
import { Check, Palette, Sparkles, Info } from 'lucide-react';

export default function SettingsPage() {
  const { theme: currentTheme, setTheme } = useThemeStore();

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="max-w-350 mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Palette className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl font-black text-foreground">Pengaturan</h1>
          </div>
          <p className="text-muted-foreground text-base ml-15">
            Sesuaikan tampilan dan preferensi aplikasi Anda
          </p>
        </div>

        {/* Theme Section */}
        <div className="animate-slide-up">
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-xl">
            {/* Section Header */}
            <div className="px-8 py-6 border-b border-border bg-muted/20">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-card-foreground">Color Schemes</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Pilih color scheme favorit Anda. Setiap tema mengubah seluruh palet warna aplikasi.
              </p>
            </div>

            {/* Theme Grid */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {(Object.keys(themes) as Theme[]).map((themeKey) => {
                  const themeData = themes[themeKey];
                  const isActive = currentTheme === themeKey;

                  return (
                    <button
                      key={themeKey}
                      onClick={() => setTheme(themeKey)}
                      className={`
                        relative p-6 rounded-xl border-2 transition-all duration-300
                        hover:scale-[1.03] hover:shadow-2xl group text-left
                        ${
                          isActive
                            ? 'border-primary shadow-xl shadow-primary/20 bg-primary/5'
                            : 'border-border hover:border-primary/50 bg-card'
                        }
                      `}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className={`font-bold text-base mb-1 ${isActive ? 'text-foreground' : 'text-card-foreground'}`}>
                            {themeData.name}
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {themeData.description}
                          </p>
                        </div>
                        {isActive && (
                          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center animate-fade-in shadow-lg shadow-primary/30 shrink-0 ml-2">
                            <Check className="w-4 h-4 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      
                      {/* Color Palette Preview */}
                      <div className="space-y-3">
                        {/* Primary Color */}
                        <div className="space-y-1.5">
                          <div
                            className="w-full h-12 rounded-lg shadow-md transition-all duration-300 group-hover:shadow-lg"
                            style={{ backgroundColor: themeData.colors.primary }}
                          />
                          <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                            Primary
                          </div>
                        </div>
                        
                        {/* Secondary Colors Grid */}
                        <div className="grid grid-cols-4 gap-2">
                          <div className="space-y-1">
                            <div
                              className="w-full h-8 rounded shadow-sm"
                              style={{ backgroundColor: themeData.colors.background }}
                            />
                            <div className="text-[9px] text-muted-foreground text-center">BG</div>
                          </div>
                          <div className="space-y-1">
                            <div
                              className="w-full h-8 rounded shadow-sm"
                              style={{ backgroundColor: themeData.colors.card }}
                            />
                            <div className="text-[9px] text-muted-foreground text-center">Card</div>
                          </div>
                          <div className="space-y-1">
                            <div
                              className="w-full h-8 rounded shadow-sm"
                              style={{ backgroundColor: themeData.colors.secondary }}
                            />
                            <div className="text-[9px] text-muted-foreground text-center">2nd</div>
                          </div>
                          <div className="space-y-1">
                            <div
                              className="w-full h-8 rounded shadow-sm"
                              style={{ backgroundColor: themeData.colors.accent }}
                            />
                            <div className="text-[9px] text-muted-foreground text-center">Acc</div>
                          </div>
                        </div>
                      </div>

                      {/* Active Indicator */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-xl bg-primary/5 pointer-events-none" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Preview Section */}
              <div className="mt-10 p-8 bg-muted/30 rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-lg shadow-primary/50" />
                  <h3 className="font-bold text-foreground text-base">Live Preview</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <Button>Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                  <div className="p-4 bg-card border border-border rounded-lg">
                    <p className="text-sm text-card-foreground">
                      Ini adalah contoh card dengan background dan border yang mengikuti tema.
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="mt-6 p-5 bg-primary/10 border border-primary/30 rounded-xl">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-sm text-foreground leading-relaxed">
                    <span className="font-bold">Catatan:</span> Tema yang Anda pilih akan disimpan secara otomatis dan diterapkan ke seluruh aplikasi. Setiap tema mengubah background, card, text, border, dan semua elemen UI.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
