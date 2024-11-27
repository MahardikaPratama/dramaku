import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const DropdownSearch = ({ label, options, onChange, name }) => {
    const [searchTerm, setSearchTerm] = useState(''); // State untuk pencarian
    const [isOpen, setIsOpen] = useState(false); // State untuk dropdown terbuka
    const [selectedOption, setSelectedOption] = useState(null); // State untuk opsi yang dipilih
    const dropdownRef = useRef(null); // Reference untuk mendeteksi klik di luar dropdown

    const optionsWithDefault = options?.length ? [label, ...options] : [label];

    // Filter opsi berdasarkan kata pencarian
    const filteredOptions = optionsWithDefault.filter(option =>
        option.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Menangani pilihan opsi
    const handleOptionClick = (option) => {
        setSelectedOption(option === label ? null : option); // Set opsi yang dipilih
        onChange({ target: { name, value: option === label ? '' : option } }); // Trigger perubahan ke parent
        setIsOpen(false); // Tutup dropdown setelah memilih opsi
    };

    // Deteksi klik di luar dropdown dan tutup dropdown jika terbuka
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    

    // Mengatur scroll pada dropdown
    const handleMouseMove = (event) => {
        const dropdownOptions = dropdownRef.current.querySelector('.dropdown-options');
        if (dropdownOptions) {
            const { clientY } = event;
            const { top, bottom } = dropdownOptions.getBoundingClientRect();
            const scrollSpeed = 20; // Atur kecepatan scroll

            if (clientY < top + 30) {
                dropdownOptions.scrollTop -= scrollSpeed; // Scroll ke atas
            } else if (clientY > bottom - 30) {
                dropdownOptions.scrollTop += scrollSpeed; // Scroll ke bawah
            }
        }
    };

    return (
        <div className="relative" ref={dropdownRef} onMouseMove={isOpen ? handleMouseMove : null}>
            {/* Button dropdown untuk membuka/menutup */}
            <button
                className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-400 bg-gray-800 border border-gray-600 rounded-md"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedOption || label} {/* Menampilkan opsi yang dipilih atau label default */}
                <FaChevronDown className="ml-2 text-gray-400" /> {/* Ikon dropdown */}
            </button>

            {isOpen && (
                <div className="absolute mt-2 min-w-[200px] bg-gray-800 rounded-md shadow-lg z-10">
                    {/* Input pencarian */}
                    <input
                        type="text"
                        className="w-full px-4 py-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-md"
                        placeholder={`Search ${label}`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {/* Opsi yang difilter */}
                    <div className="p-1 overflow-y-auto dropdown-options max-h-40">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, idx) => (
                                <div
                                    key={idx}
                                    className="px-4 py-2 text-gray-300 rounded-md cursor-pointer hover:bg-gray-600"
                                    onClick={() => handleOptionClick(option)}
                                >
                                    {option}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-2 text-gray-400">
                                No results found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropdownSearch;
