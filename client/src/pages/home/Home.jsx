import './Home.css'
import { useState } from "react";
import Header from "../../components/Header";
import SearchBar from "./SearchBar";
import EventBannerList from "./EventBannerList";
import ProductList from "./ProductList";

const Home = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);

    return (
        <>
            <div className="app-container">
                <Header onMyInfoClick={() => setShowLoginModal(true)}/>
                {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
                <SearchBar />
                <EventBannerList />
                <ProductList />
            </div>
        </>
    )
}

export default Home;