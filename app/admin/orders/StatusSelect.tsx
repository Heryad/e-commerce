'use client';

import { OrderStatus } from '@prisma/client';

interface StatusSelectProps {
    orderId: string;
    currentStatus: OrderStatus;
    updateAction: (id: string, formData: FormData) => Promise<void>;
    className?: string; // Add optional className
}

export default function StatusSelect({ orderId, currentStatus, updateAction, className }: StatusSelectProps) {
    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const formData = new FormData();
        formData.append('status', e.target.value);
        await updateAction(orderId, formData);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
            case 'SHIPPED': return 'bg-purple-100 text-purple-800';
            case 'DELIVERED': return 'bg-green-100 text-green-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // If a custom className is provided, we might not want the default status colors 
    // or we might want to merge them. For the detail page, it uses a standard border.
    const baseClass = className
        ? className
        : `px-2 py-1 rounded text-xs font-semibold border-none cursor-pointer ${getStatusColor(currentStatus)}`;

    return (
        <select
            name="status"
            defaultValue={currentStatus}
            onChange={handleStatusChange}
            className={baseClass}
        >
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
        </select>
    );
}
