import './App.css';
import Quiz from './componentes/quiz/Quiz.jsx';
import { useEffect, useState } from 'react';
import yellowBlob from './assets/yellow-blob.png';
import blueBlob from './assets/blue-blob.png';
import downArrow from './assets/chevron-down.png';
import upArrow from './assets/chevron-up.png';
import arrowLeft from './assets/arrow-left-32.png';
import Dropdown from 'react-dropdown';

function App() {
    const [categories, setCategories] = useState([]);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const getCategories = async () => {
        const response = await fetch('https://opentdb.com/api_category.php');
        const responseJson = await response.json();

        const categoryArray = responseJson.trivia_categories.map(cat => (
            {
                id: cat.id,
                label: cat.name,
            }
        ));

        setCategories(categoryArray);
        setSelectedCategory({
            id: categoryArray[0].id,
            label: categoryArray[0].label,
        });
    };

    useEffect(() => {
        getCategories().catch(console.error);
    }, []);

    const changeCategory = ({ label }) => {
        const selected = categories.find(cat => cat.label === label);
        setSelectedCategory({
            id: selected.id,
            label: selected.label,
        });
        setIsDropdownOpen(false);
    };

    const categoryLabels = categories.map(category => category.label);

    return (
        <div className="app">
            <img className="app--yellow-blob"
                 width={isGameStarted ? '150px' : '300px'}
                 src={yellowBlob} alt="Yellow Blob Icon"/>

            {
                isGameStarted ? (
                    <>
                        <img src={arrowLeft}
                             alt="Arrow Left"
                             className="app--back-arrow"
                             onClick={() => setIsGameStarted(false)}
                        />
                        <Quiz categoryId={selectedCategory.id}/>
                    </>
                ) : (
                    <div className="app--starting-view">
                        {
                            !isDropdownOpen && (
                                <>
                                    <h1 className="app--starting-view-title karla-font">Quizzical</h1>
                                    <p className="app--starting-view-description inter-font">
                                        Let's see how smart you are. Select a category :)
                                    </p>
                                </>
                            )
                        }

                        <Dropdown options={categoryLabels}
                                  value={selectedCategory.label}
                                  onChange={changeCategory}
                                  className={`app--dropdown inter-font ${!isDropdownOpen && 'app--dropdown-margin'}`}
                                  arrowOpen={<img src={upArrow} alt="Arrow Down"/>}
                                  arrowClosed={<img src={downArrow} alt="Arrow Up"/>}
                                  menuClassName="app--dropdown-menu"
                                  onFocus={() => setIsDropdownOpen(true)}
                        />

                        {
                            !isDropdownOpen && (
                                <button className="app--starting-view-button inter-font"
                                        onClick={() => setIsGameStarted(true)}>
                                    Start quiz
                                </button>
                            )
                        }
                    </div>
                )
            }

            <img className="app--blue-blob"
                 width={isGameStarted ? '90px' : '250px'}
                 src={blueBlob} alt="Blue Blob Icon"/>
        </div>
    );
}

export default App;