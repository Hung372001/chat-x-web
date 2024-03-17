import clsx from 'clsx';
import Link from 'next/link';

interface SidebarItemProps {
  label: string;
  icon: any;
  activeIcon: any;
  href: string;
  onClick?: () => void;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  href,
  icon,
  activeIcon,
  active,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  return (
    <li onClick={handleClick} key={label}>
      <Link
        href={href}
        className={clsx(
          `
            group 
            flex 
            gap-x-3 
            rounded-md 
            p-3 
            text-sm 
            font-semibold 
            leading-6 
            text-gray-500 
            hover:bg-gray-100 
            hover:text-black
          `
        )}
      >
        {active ? activeIcon : icon}
        <span className='sr-only'>{label}</span>
      </Link>
    </li>
  );
};

export default SidebarItem;
