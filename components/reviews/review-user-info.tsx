import Link from 'next/link';

interface ReviewUserInfoProps {
  user: any;
}

export function ReviewUserInfo({ user }: ReviewUserInfoProps) {
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#00dc74]/20 border border-[#00dc74]/30 flex items-center justify-center">
          <span className="text-[#00dc74] font-bold text-sm sm:text-base">U</span>
        </div>
        <div>
          <p className="text-white font-medium text-sm sm:text-base">Anonymous</p>
        </div>
      </div>
    );
  }

  const displayName = user.display_name || user.username || 'Anonymous';
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <Link href={`/user/${user.id}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#00dc74]/20 border border-[#00dc74]/30 flex items-center justify-center group-hover:border-[#00dc74]/50 transition-colors cursor-pointer">
        <span className="text-[#00dc74] font-bold text-sm sm:text-base">{initials}</span>
      </div>
      <div>
        <p className="text-white font-medium text-sm sm:text-base group-hover:text-[#00dc74] transition-colors">{displayName}</p>
        {user.bio && (
          <p className="text-neutral-500 text-xs line-clamp-1">{user.bio}</p>
        )}
      </div>
    </Link>
  );
}
