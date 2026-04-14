import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="bg-red-500 text-white p-10">
            <h1>Prod Office</h1>
            <nav>
                <Link to="/productos">Ir a Productos</Link>
            </nav>
        </div>
        
    );
}