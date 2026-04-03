'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Search, Building2, Shield, AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface License {
    _id: string;
    organizationName: string;
    status: string;
    subscriptionDetails: {
        planType: string;
        endDate: string | null;
    };
    assignedSubAdminId: {
        _id: string;
        name: string;
        email: string;
        accountStatus: string;
    };
    createdAt: string;
}

export default function LicenseManagement() {
    const [licenses, setLicenses] = useState<License[]>([])
    const [availableUsers, setAvailableUsers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [error, setError] = useState('')

    // Form string state
    const [formData, setFormData] = useState({
        organizationName: '',
        planType: 'Enterprise',
        country: '',
        city: '',
        userId: '',
    })

    useEffect(() => {
        fetchLicenses()
        fetchUsers()
    }, [])
    
    const fetchUsers = async () => {
        try {
            // Fetch unassigned users (or all users)
            const res = await fetch('/api/admin/users')
            if (res.ok) {
                const data = await res.json()
                // Only show users that are not super-admins (so we don't accidentally re-assign them)
                setAvailableUsers(data.users.filter((u: any) => u.role !== 'super-admin'))
            }
        } catch (error) {
            console.error('Error fetching users:', error)
        }
    }

    const fetchLicenses = async () => {
        try {
            const res = await fetch('/api/admin/licenses')
            if (res.ok) {
                const data = await res.json()
                setLicenses(data.licenses)
            }
        } catch (error) {
            console.error('Error fetching licenses:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateLicense = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        try {
            const res = await fetch('/api/admin/licenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Failed to create license')
                return
            }

            // Success
            setIsCreateModalOpen(false)
            setFormData({
                organizationName: '',
                planType: 'Enterprise',
                country: '',
                city: '',
                userId: '',
            })
            fetchLicenses()

        } catch (error) {
            setError('Network error processing request')
            console.error(error)
        }
    }

    const filteredLicenses = licenses.filter(lic =>
        lic.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lic.assignedSubAdminId?.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Building2 className="h-8 w-8 text-yellow-400" />
                        License & Organization Manager
                    </h1>
                    <p className="text-gray-400 mt-2">Manage client systems, geographic boundaries, and assign sub-admin operations teams.</p>
                </div>
                
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-semibold shadow-lg">
                            <Plus className="mr-2 h-4 w-4" /> Issue New License
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] bg-slate-900 text-white border-slate-700">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                <Shield className="h-6 w-6 text-yellow-400" /> 
                                Provision Client License
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateLicense} className="space-y-6 mt-4">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5" />
                                    {error}
                                </div>
                            )}
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <Label>Organization Name (License Holder)</Label>
                                    <Input 
                                        required
                                        placeholder="e.g. State of Arkansas" 
                                        value={formData.organizationName}
                                        onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                                        className="bg-slate-800 border-slate-700" 
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label>Country Bound</Label>
                                    <Input 
                                        required
                                        placeholder="e.g. USA" 
                                        value={formData.country}
                                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                                        className="bg-slate-800 border-slate-700" 
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>City / State Bound</Label>
                                    <Input 
                                        required
                                        placeholder="e.g. Arkansas" 
                                        value={formData.city}
                                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                                        className="bg-slate-800 border-slate-700" 
                                    />
                                </div>
                            </div>

                            <div className="border-t border-slate-700 pt-4">
                                <h3 className="text-lg font-semibold mb-4 text-emerald-400">Assign Dedicated Sub-Admin</h3>
                                <div className="space-y-2">
                                    <Label>Select User from Platform</Label>
                                    <select 
                                        required
                                        value={formData.userId}
                                        onChange={(e) => setFormData({...formData, userId: e.target.value})}
                                        className="w-full flex h-10 items-center justify-between rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="" disabled>-- Select a User --</option>
                                        {availableUsers.map(user => (
                                            <option key={user._id} value={user._id}>
                                                {user.name} ({user.email}) - {user.role}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-slate-500 mt-1">This user will be promoted to Sub-Admin and given control over this particular geographic license.</p>
                                </div>
                            </div>
                            
                            <div className="flex justify-end pt-4">
                                <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-lg">
                                    Mint License & Assign Admin
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden rounded-xl">
                <CardHeader className="bg-slate-900/50 border-b border-slate-800 p-6">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-medium text-white">Active Operational Licenses</CardTitle>
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search by client or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-slate-800/50 border-slate-700 text-slate-200 placeholder-slate-500 rounded-full"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-800/30">
                            <TableRow className="border-slate-800">
                                <TableHead className="text-slate-400 font-medium py-4 px-6">Client / Organization</TableHead>
                                <TableHead className="text-slate-400 font-medium py-4 px-6">Assigned Sub-Admin</TableHead>
                                <TableHead className="text-slate-400 font-medium py-4 px-6">Status</TableHead>
                                <TableHead className="text-slate-400 font-medium py-4 px-6">Date Created</TableHead>
                                <TableHead className="text-slate-400 font-medium py-4 px-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                                        Loading licenses...
                                    </TableCell>
                                </TableRow>
                            ) : filteredLicenses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                                        No organization licenses found. Issue one to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredLicenses.map((lic) => (
                                    <TableRow key={lic._id} className="border-slate-800 hover:bg-slate-800/20 transition-colors">
                                        <TableCell className="font-medium text-white px-6 py-4">
                                            {lic.organizationName}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-slate-300">
                                            <div className="flex flex-col">
                                                <span>{lic.assignedSubAdminId?.name || 'Unassigned'}</span>
                                                <span className="text-xs text-slate-500">{lic.assignedSubAdminId?.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                lic.status === 'active' 
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                                : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                            }`}>
                                                {lic.status.toUpperCase()}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-slate-400 px-6 py-4">
                                            {new Date(lic.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <Button variant="outline" size="sm" className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                                                Manage
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
