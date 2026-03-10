import { Settings, User, Bell, Database, Palette } from 'lucide-react'

export default function SettingsPage() {
    return (
        <section className="flex-1 flex flex-col overflow-y-auto border-r border-primary/10 p-6 lg:p-12 space-y-8 atmospheric-glow relative z-10 custom-scrollbar shadow-inner">
            <div className="flex items-center gap-3 border-b border-primary/10 pb-6">
                <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                    <Settings className="text-primary" />
                </div>
                <div>
                    <h2 className="font-display text-2xl font-bold text-[#FFD9CC] uppercase tracking-widest">Settings</h2>
                    <p className="text-slate-400 text-xs italic">Manage your Text2Reel preferences and account details</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Section */}
                <div className="glass-panel p-6 rounded-3xl border border-primary/20 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <User className="text-primary" size={20} />
                        <h3 className="font-display font-bold uppercase tracking-widest text-[#FFD9CC]">Profile Details</h3>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Display Name</label>
                            <input type="text" defaultValue="Guest User" className="w-full bg-black/40 border border-primary/20 rounded-xl px-4 py-2 mt-1 text-sm text-[#FFD9CC] focus:outline-none focus:border-primary/50 transition-all font-medium" />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Email Address</label>
                            <input type="email" defaultValue="Not logged in" disabled className="w-full bg-black/20 border border-primary/10 rounded-xl px-4 py-2 mt-1 text-sm text-slate-500 cursor-not-allowed font-medium" />
                        </div>
                    </div>
                </div>

                {/* Preferences Section */}
                <div className="glass-panel p-6 rounded-3xl border border-primary/20 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Palette className="text-primary" size={20} />
                        <h3 className="font-display font-bold uppercase tracking-widest text-[#FFD9CC]">App Preferences</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-primary/10">
                            <div>
                                <p className="text-xs font-bold text-slate-300">Default Video Quality</p>
                                <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">720p vs 1080p</p>
                            </div>
                            <select className="bg-black/60 text-xs text-primary border border-primary/20 rounded-lg px-2 py-1 outline-none">
                                <option>1080p (HD)</option>
                                <option>720p (Fast)</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-primary/10">
                            <div>
                                <p className="text-xs font-bold text-slate-300">Auto-Save Projects</p>
                                <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">Save periodically</p>
                            </div>
                            <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 size-3 bg-background-dark rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Storage & Data */}
                <div className="glass-panel p-6 rounded-3xl border border-primary/20 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Database className="text-primary" size={20} />
                        <h3 className="font-display font-bold uppercase tracking-widest text-[#FFD9CC]">Storage & Data</h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Projects and scenes are stored in your local SQLite database and serialized in your browser&apos;s persistent storage.
                    </p>
                    <button className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold py-2 rounded-xl transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                        Clear Cache Data
                    </button>
                </div>

                {/* Notifications */}
                <div className="glass-panel p-6 rounded-3xl border border-primary/20 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Bell className="text-primary" size={20} />
                        <h3 className="font-display font-bold uppercase tracking-widest text-[#FFD9CC]">Notifications</h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Floating popup notifications (Toasts) are currently enabled for saving and status alerts.
                    </p>
                    <button className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 font-bold py-2 rounded-xl transition-all text-[10px] uppercase tracking-widest">
                        Manage Alerts
                    </button>
                </div>
            </div>
        </section>
    )
}
