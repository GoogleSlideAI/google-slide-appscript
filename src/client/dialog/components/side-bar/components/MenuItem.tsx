import { ListItem, ListItemIcon, ListItemText } from '@mui/material';

type MenuItemProps = {
  id: string;
  icon: React.ReactNode;
  text: string;
  isActive?: boolean;
  onClick?: () => void;
  showText?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, text, isActive, onClick, showText = false }) => (
  <ListItem
    onClick={() => {
      onClick && onClick();
    }}
    className={`
      flex items-center px-3 py-2 cursor-pointer rounded-none h-14
      ${isActive ? 'bg-blue-100 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}
      ${showText ? 'justify-center' : 'justify-center'}
      transition-colors duration-200
    `}
  >
    <ListItemIcon 
      className={`
        min-w-0 
        ${isActive ? 'text-blue-600' : 'text-gray-600'}
      `}
    >
      {icon}
    </ListItemIcon>
    {showText && (
      <ListItemText
        primary={text}
        className="ml-2"
        primaryTypographyProps={{
          className: `${isActive ? 'text-blue-600' : 'text-gray-700'} font-normal`
        }}
      />
    )}
  </ListItem>
);

export default MenuItem;