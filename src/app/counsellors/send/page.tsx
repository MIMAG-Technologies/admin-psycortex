'use client';
import { Link, LinksPayload, sendLinks } from '@/utils/send_links'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy, Download, ArrowLeft, Plus, Trash2 } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { toast } from 'react-toastify';

export default function SendLinksPage() {
    const [counsellors, setCounsellors] = useState<LinksPayload[]>([]);
    const [links, setLinks] = useState<Link[]>([]);
    const [showLinks, setShowLinks] = useState(false);

    const addCounsellor = () => {
        setCounsellors([...counsellors, {
            email: '',
            phone: '',
            expiry: '',
            payload: {
                email: '',
                phone: '',
                status: 'new',
                counsellorId: null,
                remark: null
            }
        }]);
    };

    const deleteCounsellor = (index: number) => {
        const updatedCounsellors = counsellors.filter((_, i) => i !== index);
        setCounsellors(updatedCounsellors);
    };

    const updateCounsellor = (index: number, field: string, value: string) => {
        const updatedCounsellors = [...counsellors];
        updatedCounsellors[index] = {
            ...updatedCounsellors[index],
            [field]: value,
            payload: {
                ...updatedCounsellors[index].payload,
                [field]: value
            }
        };
        setCounsellors(updatedCounsellors);
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string) => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    };

    const validateDate = (date: string) => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const inputDate = new Date(date);
        inputDate.setHours(0, 0, 0, 0);

        return inputDate >= tomorrow;
    };

    const validateCounsellors = () => {
        if (counsellors.length === 0) {
            toast.error('Please add at least one counsellor');
            return false;
        }

        for (let i = 0; i < counsellors.length; i++) {
            const counsellor = counsellors[i];

            if (!counsellor.email || !counsellor.phone || !counsellor.expiry) {
                toast.error(`Please fill all fields for counsellor ${i + 1}`);
                return false;
            }

            if (!validateEmail(counsellor.email)) {
                toast.error(`Invalid email format for counsellor ${i + 1}`);
                return false;
            }

            if (!validatePhone(counsellor.phone)) {
                toast.error(`Invalid phone number for counsellor ${i + 1}. Must be 10 digits`);
                return false;
            }

            if (!validateDate(counsellor.expiry)) {
                toast.error(`Expiry date for counsellor ${i + 1} must be tomorrow or later`);
                return false;
            }
        }

        return true;
    };

    const handleSendLinks = async () => {
        if (!validateCounsellors()) return;

        const res = await sendLinks(counsellors);
        setLinks(res);
        setShowLinks(true);
        // Clear entries after generating links
        setCounsellors([]);
    };

    const handleSendEmail = () => {
        toast.info('This feature is yet to be implemented');
    };

    const handleSendAllEmails = () => {
        toast.info('This feature is yet to be implemented');
    };

    const downloadCSV = () => {
        const csvContent = [
            ['Email', 'Link'],
            ...links.map(link => [
                link.email,
                `http://democounsellor.psycortex.in/apply?token=${link.token}`
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'counsellor-links.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Link copied to clipboard');
    };

    const truncateLink = (token: string) => {
        const fullLink = `https://democounsellor.psycortex.in/apply?token=${token}`;
        return `${fullLink.substring(0, 40)}...`;
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    {showLinks ? 'Generated Links' : 'Add Counsellors'}
                </h1>
                <div className="flex gap-2">
                    {!showLinks ? (
                        <>
                            <Button onClick={addCounsellor} variant="outline">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Counsellor
                            </Button>
                            <Button className='text-white' onClick={handleSendLinks}>Generate Links</Button>
                        </>
                    ) : (
                        <Button variant="outline" onClick={() => setShowLinks(false)}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Add Counsellors
                        </Button>
                    )}
                </div>
            </div>

            {!showLinks ? (
                <>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Expiry Date</TableHead>
                                <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {counsellors.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                        No counsellors added yet. Click the "Add Counsellor" button to enter data.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                counsellors.map((counsellor, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Input
                                                type="email"
                                                placeholder="Email"
                                                value={counsellor.email}
                                                onChange={(e) => updateCounsellor(index, 'email', e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="tel"
                                                placeholder="Phone"
                                                value={counsellor.phone}
                                                onChange={(e) => updateCounsellor(index, 'phone', e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="date"
                                                value={counsellor.expiry}
                                                onChange={(e) => updateCounsellor(index, 'expiry', e.target.value)}
                                                min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => deleteCounsellor(index)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </>
            ) : (
                <>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Link</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {links.map((link, index) => (
                                <TableRow key={index}>
                                    <TableCell>{link.email}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">
                                                {truncateLink(link.token)}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => copyToClipboard(`http://democounsellor.psycortex.in/apply?token=${link.token}`)}
                                            >
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button onClick={handleSendEmail} variant="outline" size="sm">
                                            Send Email
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="flex gap-4 mt-6">
                        <Button className='text-white' onClick={handleSendAllEmails}>Send All Emails</Button>
                        <Button onClick={downloadCSV} variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Download CSV
                        </Button>
                    </div>
                </>
            )}
        </div>
    )
}
