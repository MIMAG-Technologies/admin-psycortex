"use client"
import { useLoading } from '@/context/LoadingContext';
import { getCounsellors, updateVerification, getCounsellor } from '@/utils/counsellor';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { IoEye, IoCheckmark, IoClose, IoCopy } from "react-icons/io5";
import { toast } from 'react-toastify';
import { LinksPayload, sendLinks } from '@/utils/send_links';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    counsellor: any;
    onConfirm: () => void;
}

function VerificationModal({ isOpen, onClose, counsellor, onConfirm }: VerificationModalProps) {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Verify Counsellor</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <h3 className="font-medium">Counsellor Details</h3>
                        <p>Name: {counsellor?.personalInfo.name}</p>
                        <p>Title: {counsellor?.professionalInfo.title}</p>
                        <p>Experience: {counsellor?.professionalInfo.yearsOfExperience} years</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="verify"
                            checked={isChecked}
                            onCheckedChange={(checked) => setIsChecked(checked as boolean)}
                        />
                        <label htmlFor="verify">
                            I confirm that I have reviewed all the documents and information
                        </label>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button
                        onClick={onConfirm}
                        disabled={!isChecked}
                        className="bg-green-500 text-white hover:bg-green-600"
                    >
                        Verify Counsellor
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface RejectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (remarks: string) => void;
    counsellor: any;
}

function RejectionModal({ isOpen, onClose, onConfirm, counsellor }: RejectionModalProps) {
    const [remarks, setRemarks] = useState('');
    const [generatedLink, setGeneratedLink] = useState('');
    const { setLoading } = useLoading();

    const handleConfirm = async () => {
        try {
            setLoading(true);
            // Fetch complete counsellor details
            const counsellorDetails = await getCounsellor(counsellor.id);

            if (!counsellorDetails?.personalInfo?.email || !counsellorDetails?.personalInfo?.phone) {
                toast.error('Could not fetch counsellor contact details');
                return;
            }

            const payload: LinksPayload[] = [{
                email: counsellorDetails.personalInfo.email,
                phone: counsellorDetails.personalInfo.phone,
                expiry: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0], // 7 days expiry
                payload: {
                    email: counsellorDetails.personalInfo.email,
                    phone: counsellorDetails.personalInfo.phone,
                    status: "reverify",
                    counsellorId: counsellor.id,
                    remark: remarks
                }
            }];

            const links = await sendLinks(payload);
            if (links && links.length > 0) {
                const link = `https://counsellor.psycortex.in/apply?token=${links[0].token}`;
                setGeneratedLink(link);
                console.log(link);
                // onConfirm(remarks);
            } else {
                toast.error('Failed to generate rejection link');
            }
        } catch (error) {
            console.error('Error generating link:', error);
            toast.error('Failed to generate rejection link');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Link copied to clipboard');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reject Application</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {!generatedLink ? (
                        <div className="space-y-2">
                            <label htmlFor="remarks" className="font-medium">
                                Rejection Remarks
                            </label>
                            <Textarea
                                id="remarks"
                                placeholder="Enter the reason for rejection..."
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="font-medium">Generated Link</label>
                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                                    <span className="text-sm text-gray-600 flex-1 break-all">
                                        {generatedLink}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(generatedLink)}
                                    >
                                        <IoCopy className="text-gray-600" size={18} />
                                    </Button>
                                </div>
                            </div>
                            <div className="text-sm text-gray-600">
                                <p>✓ Link has been generated successfully</p>
                                <p>✓ You can copy the link and share it with the counsellor</p>
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    {!generatedLink ? (
                        <>
                            <Button variant="outline" onClick={onClose}>Cancel</Button>
                            <Button
                                onClick={handleConfirm}
                                disabled={!remarks.trim()}
                                className="bg-red-500 text-white hover:bg-red-600"
                            >
                                Generate Rejection Link
                            </Button>
                        </>
                    ) : (
                        <Button
                            onClick={onClose}
                            className="bg-primary text-white"
                        >
                            Close
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function VerificationCard({
    counsellor,
    onViewProfile,
    onVerify,
    onReject,
}: {
    counsellor: any;
    onViewProfile: (id: string) => void;
    onVerify: (id: string) => void;
    onReject: (id: string) => void;
}) {
    const { name, profileImage } = counsellor.personalInfo;
    const { title, yearsOfExperience } = counsellor.professionalInfo;
    const { specialties, languages } = counsellor.practiceInfo;
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);

    return (
        <>
            <div className="border bg-slate-100 border-slate-300 rounded-lg p-5 flex flex-col sm:flex-row gap-4 items-center shadow-sm hover:shadow-md transition">
                {/* Profile Image */}
                <img
                    src={profileImage || "/images/user-dummy-img.png"}
                    alt={name}
                    className="w-20 h-20 rounded-full object-cover border border-gray-300"
                />

                {/* Counsellor Details */}
                <div className="flex-1 space-y-1">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {name} <span className="text-gray-500">({title})</span>
                    </h2>
                    <p className="text-sm text-gray-600">
                        Experience:{" "}
                        <span className="font-medium">{yearsOfExperience} years</span>
                    </p>
                    <p className="text-sm text-gray-600">
                        Specialties:{" "}
                        <span className="font-medium">
                            {specialties.slice(0, 2).join(", ")}
                        </span>
                    </p>
                    <p className="text-sm text-gray-600">
                        Languages:{" "}
                        <span className="font-medium">
                            {languages.map((lang: any) => lang.language).join(", ")}
                        </span>
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => onViewProfile(counsellor.id)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white rounded-md text-gray-700 font-medium hover:bg-gray-100 transition"
                    >
                        <IoEye className="text-blue-600" size={18} />
                        View Profile
                    </button>

                    <button
                        onClick={() => setShowVerifyModal(true)}
                        className="flex items-center gap-2 px-4 py-2 border border-green-500 bg-green-500 rounded-md text-white font-medium hover:bg-green-600 hover:border-green-600 transition"
                    >
                        <IoCheckmark className="text-white" size={18} />
                        Verify
                    </button>

                    <button
                        onClick={() => setShowRejectModal(true)}
                        className="flex items-center gap-2 px-4 py-2 border border-red-500 bg-red-500 rounded-md text-white font-medium hover:bg-red-600 hover:border-red-600 transition"
                    >
                        <IoClose className="text-white" size={18} />
                        Reject
                    </button>
                </div>
            </div>

            <VerificationModal
                isOpen={showVerifyModal}
                onClose={() => setShowVerifyModal(false)}
                counsellor={counsellor}
                onConfirm={() => {
                    onVerify(counsellor.id);
                    setShowVerifyModal(false);
                }}
            />

            <RejectionModal
                isOpen={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                counsellor={counsellor}
                onConfirm={(remarks) => {
                    onReject(counsellor.id);
                }}
            />
        </>
    );
}

export default function VerificationPage() {
    const [counsellors, setCounsellors] = useState<Array<any>>([]);
    const router = useRouter();
    const { setLoading } = useLoading();
    const isFetched = useRef(false);

    useEffect(() => {
        if (isFetched.current) return;
        isFetched.current = true;

        const fetchAllCounsellors = async () => {
            setLoading(true);
            try {
                const response = await getCounsellors();
                setCounsellors(response.filter((counsellor: any) =>
                    counsellor.verificationStatus === "0" || counsellor.documentsVerified === "0"
                ));
            } finally {
                setLoading(false);
            }
        };

        fetchAllCounsellors();
    }, []);

    const handleViewProfile = (id: string) => {
        router.push(`/counsellors/view?id=${id}`);
    };

    const handleVerify = async (id: string) => {
        try {
            const success = await updateVerification(id, {
                isVerified: true,
                documentsVerified: true,
                backgroundCheckDate: new Date().toISOString().split('T')[0]
            });
            if (success) {
                toast.success('Counsellor verified successfully');
            }
            else {
                toast.error('Failed to verify counsellor');
            }
            setCounsellors(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            toast.error('Failed to verify counsellor');
        }
    };

    const handleReject = async (id: string) => {
        try {
            // TODO: Implement actual rejection API call
            toast.success('Rejection email sent to counsellor');
            // Remove counsellor from the list
            setCounsellors(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            toast.error('Failed to reject counsellor');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Counsellor Verification</h1>

            {counsellors.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No counsellors pending verification.
                </div>
            ) : (
                <div className="space-y-4">
                    {counsellors.map((counsellor) => (
                        <VerificationCard
                            key={counsellor.id}
                            counsellor={counsellor}
                            onViewProfile={handleViewProfile}
                            onVerify={handleVerify}
                            onReject={handleReject}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
