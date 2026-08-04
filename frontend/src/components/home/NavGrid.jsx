const links = [['◈','Terms'],['◌','Privacy'],['i','About'],['?','FAQ']];
export default function NavGrid() { return <section className="mx-4 grid grid-cols-4 gap-2">{links.map(([icon,text])=><button key={text} className="rounded-2xl bg-white py-3 text-xs font-medium text-slate-600 shadow-sm"><span className="mb-1 block text-lg text-emerald-500">{icon}</span>{text}</button>)}</section>; }
