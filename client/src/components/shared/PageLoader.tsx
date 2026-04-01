import { Loader2 } from 'lucide-react'

export default function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
          <Loader2 size={20} className="text-gold animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground">جاري التحميل...</p>
      </div>
    </div>
  )
}
