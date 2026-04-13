import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div>
            <h1>Prod Office</h1>
            <nav>
                <Link to="/productos">Ir a Productos</Link>
            </nav>
        </div>
    );
}