import { Play, SkipBack, SkipForward, Volume2, Heart } from 'lucide-react'

export default function Player() {
  return (
    <div className="h-24 bg-bg border-t border-bg-light px-6 flex items-center justify-between">
      {/* Song Info (Placeholder) */}
      <div className="flex items-center gap-4 w-64">
        <div className="w-14 h-14 bg-bg-light rounded flex items-center justify-center">
          <Play className="w-6 h-6 text-fg-dark" />
        </div>
        <div>
          <p className="text-fg font-medium">No hay canción</p>
          <p className="text-sm text-fg-dark">Sprint 1 - Visual only</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex-1 max-w-2xl mx-8">
        <div className="flex items-center justify-center gap-4 mb-2">
          <button 
            disabled
            className="p-2 rounded-full hover:bg-bg-light transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <SkipBack className="w-5 h-5 text-fg" />
          </button>
          <button 
            disabled
            className="w-12 h-12 rounded-full bg-primary hover:bg-primary-dark flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play className="w-6 h-6 text-bg-dark fill-bg-dark" />
          </button>
          <button 
            disabled
            className="p-2 rounded-full hover:bg-bg-light transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <SkipForward className="w-5 h-5 text-fg" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 text-xs text-fg-dark">
          <span>0:00</span>
          <div className="flex-1 h-1 bg-bg-light rounded-full overflow-hidden">
            <div className="h-full w-0 bg-primary"></div>
          </div>
          <span>0:00</span>
        </div>
      </div>

      {/* Volume & Actions */}
      <div className="flex items-center gap-4 w-64 justify-end">
        <button 
          disabled
          className="p-2 rounded-full hover:bg-bg-light transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Heart className="w-5 h-5 text-fg" />
        </button>
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-fg-dark" />
          <input
            type="range"
            min="0"
            max="100"
            value="50"
            disabled
            className="w-24 h-1 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  )
}
