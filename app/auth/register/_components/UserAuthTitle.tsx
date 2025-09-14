import { Playfair } from 'next/font/google';

const playfair = Playfair({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

interface UserAuthTitleProps {
  title: string;
  subtitle: string;
}

export const UserAuthTitle = ({ title, subtitle }: UserAuthTitleProps) => {
  return (
    <div className="mb-6">
      <h1 className={`text-4xl font-bold text-adult-green mb-2 ${playfair.className}`}>
        {title}
      </h1>
      <p className="text-gray-600 text-sm">
        {subtitle}
      </p>
    </div>
  );
};