import { useEffect, useRef } from 'react';
import Scene3D from './Scene3D';
import Lenis from '@studio-freight/lenis'

function App() {
    const scrollRef = useRef(0);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.3,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            smoothTouch: false,
            touchMultiplier: 2.5,
        });

        scrollRef.current = lenis.progress;
        lenis.on('scroll', (e) => {
            scrollRef.current = e.progress;
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return (
        <div className="App">
            <div id='scene-container'>
                <Scene3D scrollRef={scrollRef} />
            </div>
        </div>
    );
}

export default App;