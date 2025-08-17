import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
	const { theme, setTheme, systemTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	if (!mounted) return null;
	const current = theme === 'system' ? systemTheme : theme;
	const isDark = current === 'dark';

	return (
		<button
			aria-label="Toggle dark mode"
			onClick={() => setTheme(isDark ? 'light' : 'dark')}
			className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/70"
		>
			{isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
		</button>
	);
};

export default ThemeToggle;