import { useEffect, useState } from 'react';
import Scene3D from './Scene3D';
import Lenis from '@studio-freight/lenis'

function App() {
    const [scrollLevel, setScrollLevel] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const maxScroll = Math.max(
                document.body.scrollHeight, 
                document.documentElement.scrollHeight,
                document.body.offsetHeight, 
                document.documentElement.offsetHeight,
                document.body.clientHeight, 
                document.documentElement.clientHeight
            );
            if (maxScroll !== 0) setScrollLevel(scrollY / maxScroll);
            
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
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
                <Scene3D scrollY={scrollLevel} />
            </div>
        </div>
    );
}

export default App;