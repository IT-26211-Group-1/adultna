import { ProblemText } from './ProblemText';
import { ProblemSubject } from './ProblemSubject';

export function Problem() {
    return (
    <section className="relative z-0 w-full min-h-[800px] bg-olivine py-10 sm:py-16 lg:py-24 flex flex-col justify-center">
            {/* Top wave */}
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full block">
                    <path
                        fill="#ffffff"
                        fillOpacity={1}
                        d="M0,160L34.3,154.7C68.6,149,137,139,206,138.7C274.3,139,343,149,411,144C480,139,549,117,617,101.3C685.7,85,754,75,823,90.7C891.4,107,960,149,1029,144C1097.1,139,1166,85,1234,58.7C1302.9,32,1371,32,1406,32L1440,32L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"
                        style={{ filter: 'drop-shadow(0 20px 16px rgba(0,0,0,0.15))' }}
                    />
                </svg>
            </div>
            <main className="relative z-10 px-2 sm:px-4 lg:px-8 w-full">
                <ProblemText />
                <ProblemSubject />
            </main>
            {/* Bottom wave */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none" style={{ transform: 'translateY(1px)', marginTop: '-1px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full block">
                    <path
                        fill="#ffffff"
                        fillOpacity={1}
                        d="M0,160L48,176C96,192,192,224,288,250.7C384,277,480,299,576,309.3C672,320,768,320,864,309.3C960,299,1056,277,1152,261.3C1248,245,1344,235,1392,229.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    />
                </svg>
            </div>
        </section>

  );
}
