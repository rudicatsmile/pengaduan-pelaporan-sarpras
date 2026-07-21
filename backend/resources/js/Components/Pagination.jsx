import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null; // Don't show if there are only "Previous" and "Next" with no actual pages

    return (
        <div className="flex flex-wrap items-center justify-center gap-1">
            {links.map((link, index) => {
                const labelStr = String(link.label);
                const isPrevious = labelStr.includes('Previous') || labelStr.includes('Sebelumnya');
                const isNext = labelStr.includes('Next') || labelStr.includes('Selanjutnya');
                
                let label = link.label;
                if (isPrevious) label = <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>;
                if (isNext) label = <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>;

                return link.url === null ? (
                    <div
                        key={index}
                        className={`px-3 py-2 text-sm text-gray-400 bg-white border border-gray-200 rounded-lg cursor-not-allowed ${
                            isPrevious || isNext ? 'flex items-center' : ''
                        }`}
                    >
                        {typeof label === 'string' ? <span dangerouslySetInnerHTML={{ __html: label }} /> : label}
                    </div>
                ) : (
                    <Link
                        key={index}
                        href={link.url}
                        className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                            link.active
                                ? 'bg-teal-600 text-white border-teal-600 shadow-sm focus:ring-2 focus:ring-teal-500 focus:ring-offset-1'
                                : 'text-gray-600 bg-white border-gray-200 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300'
                        } ${isPrevious || isNext ? 'flex items-center' : ''}`}
                    >
                        {typeof label === 'string' ? <span dangerouslySetInnerHTML={{ __html: label }} /> : label}
                    </Link>
                );
            })}
        </div>
    );
}
