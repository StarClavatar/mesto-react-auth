
import Header from './Header';
import EditProfilePopup from './EditProfilePopup';
import Main from './Main';
import Footer from './Footer';
import AddPlacePopup from './AddPlacePopup';
import EditAvatarPopup from './EditAvatarPopup';
import ImagePopup from './ImagePopup';
import React from 'react';
import Api from '../utils/Api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';


function App() {
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [currentUser, setCurrentUser] = React.useState({name:'',link:'',about:''});
    const [selectedCard, setSelectedCard] = React.useState(null);
    const [cards, setCards] = React.useState([]);
    
    const handleEditProfileClick = () => { setIsEditProfilePopupOpen (true); } 
    const handleAddPlaceClick = () => { setIsAddPlacePopupOpen (true); } 
    const handleEditAvatarClick = () => { setIsEditAvatarPopupOpen(true); } 
    const handleCardClick = (link) => { setSelectedCard(link); }

    React.useEffect(
        ()=>{
            //загружаем профиль пользователя и карточки 
            Promise.all([Api.getProfile(), Api.getInitialCards()])
                .then(([profile, cards]) => {
                    //отображаем информацию профиля    
                    setCurrentUser(profile);
                    //рисуем все карточки
                    setCards(cards);
            })
            .catch(err => { console.log(err) }); 
        },[]
    );
        
    const closeAllPopups = () => {
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
        setSelectedCard(null);
    }

    function handleUpdateUser(user){
        Api.patchProfile(user.name,user.about)
        .then ((res)=>{
            setCurrentUser(res);
            closeAllPopups();
        })
        .catch(err=>console.log(err))
        
    }

    function handleUpdateAvatar(avatarUrl){
        Api.patchProfilePhoto(avatarUrl)
        .then ((res)=>{
            setCurrentUser(res);
            closeAllPopups();
        })
        .catch(err=>console.log(err))   
    }

    function handleAddPlaceSubmit(card){
        Api.createNewCard(card.name, card.link)
        .then ((newCard)=>{
            console.log(newCard);
            setCards([newCard,...cards]);
            closeAllPopups();
        })
        .catch(err=>console.log(err))   
    }

    function handleCardLike(card) {
        // Снова проверяем, есть ли уже лайк на этой карточке
        const isLiked = card.likes.some(i => i._id === currentUser._id);
        // Отправляем запрос в API и получаем обновлённые данные карточки
        Api.updateLikeStatus(card._id, !isLiked)
        .then((newCard) => {
            setCards((prevState)=>{return prevState.map((c) => c._id === card._id ? newCard : c)});
        })
        .catch(err=>console.log(err));
    } 

    function handleCardDelete(card){
        Api.deleteCard(card._id)
        .then (res=>{
            console.log (res)
            setCards(cards.filter((c) => c._id !== card._id && c));
        })
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <Header />

            
            <Main 
                onEditProfile={handleEditProfileClick} 
                onAddPlace={handleAddPlaceClick} 
                onEditAvatar={handleEditAvatarClick} 
                cards={cards}
                onCardLike={handleCardLike}
                onCardClick={handleCardClick}
                onCardDelete={handleCardDelete}
            />

            <EditProfilePopup 
                isOpen={isEditProfilePopupOpen} 
                onUpdateUser={handleUpdateUser} 
                onClose={closeAllPopups}
            />  

            <AddPlacePopup 
                isOpen={isAddPlacePopupOpen} 
                onAddPlace={handleAddPlaceSubmit} 
                onClose={closeAllPopups}
            />

            <EditAvatarPopup 
                isOpen={isEditAvatarPopupOpen} 
                onUpdateAvatar={handleUpdateAvatar} 
                onClose={closeAllPopups} 
            /> 

            <ImagePopup 
                link={selectedCard} 
                onClose={closeAllPopups}
            />
            
            <Footer />      
        </CurrentUserContext.Provider>
    );
}

export default App;
