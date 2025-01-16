import { useState } from 'react';
import { Box, List, Tooltip } from '@mui/material';
import {
  House,
  Clock,
  QuestionCircle,
  Person,
  PencilSquare,
} from 'react-bootstrap-icons';
import ExpandIcon from '../../../shared/assets/expand-icon.svg?react';
import MenuItem from './components/MenuItem';

type SidebarProps = {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Sidebar = ({ currentPage, onPageChange }: SidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const topMenuItems = [
    { id: 'expand', icon: <ExpandIcon />, text: '' },
    { id: 'home', icon: <House size={18} />, text: 'Home', route: 'home' },
    { id: 'editor', icon: <PencilSquare size={18} />, text: 'Editor', route: 'editor' },
    { id: 'history', icon: <Clock size={18} />, text: 'History', route: 'history' },
  ];

  const bottomMenuItems = [
    { id: 'help', icon: <QuestionCircle size={18} />, text: 'Help', route: 'help' },
    { id: 'account', icon: <Person size={18} />, text: 'Your Account', route: 'account' },
  ];

  const handleItemClick = (id: string, route?: string) => {
    if (id === 'expand') {
      toggleSidebar();
    } else if (route) {
      onPageChange(route);
    }
  };

  const renderMenuItems = (items: typeof topMenuItems) => {
    return items.map((item) => (
      <Tooltip key={item.id} title={item.id} placement="right">
        <div>
          <MenuItem
            id={item.id}
            icon={item.icon}
            text={item.text}
            isActive={item.id === currentPage}
            showText={isExpanded}
            onClick={() => handleItemClick(item.id, item.route)}
          />
        </div>
      </Tooltip>
    ));
  };

  return (
    <Box 
      className={`
        h-screen bg-white border-r border-gray-200 transition-all duration-300
        ${isExpanded ? 'w-56' : 'w-14'}
      `}
    >
      <List className="p-0 flex flex-col h-full">
        <div className="space-y-1">
          {renderMenuItems(topMenuItems)}
        </div>
        <div className="mt-auto space-y-1">
          {renderMenuItems(bottomMenuItems)}
        </div>
      </List>
    </Box>
  );
};

export default Sidebar;