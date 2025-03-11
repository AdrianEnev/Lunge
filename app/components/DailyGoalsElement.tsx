import { changeDailyGoal } from "~/use/useChangeDailyGoal";

interface DailyGoalsElementProps {
    dailyGoal: any;
    index: number;
    selectedNutrient: string;
    setSelectedNutrient: (nutrient: string) => void;
    dailyGoals: any;
}

const DailyGoalsElement = ({ dailyGoal, index, selectedNutrient, setSelectedNutrient, dailyGoals }: DailyGoalsElementProps) => {

    return (
        <div
            className={`w-full h-10 text-gray-600 border-y border-gray-100 px-3 
            flex flex-row items-center
           `}
        >
            {['calories', 'protein', 'carbs', 'fat'].map((nutrient) => (
                <button
                    key={nutrient}
                    className={`text-base w-1/4 hover:opacity-50 
                        ${selectedNutrient === nutrient ? 'text-red-400' : ''}
                    `}
                    onClick={() => setSelectedNutrient(nutrient)}
                >
                    {selectedNutrient === nutrient ? (
                        <input
                            type="text"
                            defaultValue={dailyGoal[nutrient]}
                            className="w-full text-center border-none outline-none"
                            onBlur={(e) => {
                                setSelectedNutrient('')
                                changeDailyGoal(nutrient, dailyGoals, e.target.value)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setSelectedNutrient('')
                                    changeDailyGoal(nutrient, dailyGoals, e.currentTarget.value)
                                }
                            }}
                            maxLength={selectedNutrient === 'calories' ? 4 : 3}
                        />
                    ) : (
                        <p>{dailyGoal[nutrient]}</p>
                    )}
                </button>
            ))}
        </div>
    );
};

export default DailyGoalsElement;