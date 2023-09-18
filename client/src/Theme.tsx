import { useState, useEffect } from "react";

function Theme() {
    const [selectedTheme, setSelectedTheme] = useState(() => {
        return localStorage.getItem("selectedTheme") || "";
    });

    const handleThemeChange = (theme: string) => {
        setSelectedTheme(theme);
    };

    useEffect(() => {
        if (selectedTheme) {
            document.body.style.backgroundColor = selectedTheme;
            localStorage.setItem("selectedTheme", selectedTheme);
        }
    }, [selectedTheme]);

    return (
        <div className="flex flex-col items-center gap-5 mt-5">
            <h2 className="text-xl">Choisis ton thème !</h2>
            <div>
                {["White", "Red", "Green", "Purple", "Teal"].map(
                    (color, index) => (
                        <label
                            key={index}
                            className={`relative inline-flex items-center mr-5 cursor-pointer`}
                        >
                            <input
                                type="radio"
                                name="theme"
                                value={color.toLowerCase()}
                                className="sr-only peer"
                                onChange={() =>
                                    handleThemeChange(color.toLowerCase())
                                }
                                checked={selectedTheme === color.toLowerCase()}
                            />
                            <div
                                className={`w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-${color.toLowerCase()}-300 dark:peer-focus:ring-${color.toLowerCase()}-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-${color.toLowerCase()}-600`}
                            ></div>
                            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                {color}
                            </span>
                        </label>
                    )
                )}
            </div>
        </div>
    );
}

export default Theme;
