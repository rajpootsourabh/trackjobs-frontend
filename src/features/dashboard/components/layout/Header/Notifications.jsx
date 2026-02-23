import { useState } from 'react';
import { Bell } from 'lucide-react';

const Notifications = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                className="relative p-2 bg-none border-none cursor-pointer rounded-md hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell className="w-5 h-5 text-gray-700" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-4 text-center">
                    0
                </span>
            </button>

            {/* Notifications dropdown content - you can add similar animation logic */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-50" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {/* Add your notification items here */}
                            <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                                <p className="text-sm text-gray-600">New new messages</p>
                                {/* <p className="text-xs text-gray-400 mt-1">5 minutes ago</p> */}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Notifications;