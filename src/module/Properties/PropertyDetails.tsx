/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { propertyDefaultValue } from "../../models/Properties"
import { PropertyServices } from "../../services/Property";
import { useParams } from "react-router";
import { categoryDefaultValue } from "../../models/Category";
import { CategoryServices } from "../../services/Category";

export const PropertyDetails = () => {
    const [data, setData] = useState(propertyDefaultValue);
    const [categoryData, setCategoryData] = useState(categoryDefaultValue);
    const { id } = useParams();

    const [isLoading, setIsLoading] = useState(true);

    // const loadCategory = async () => {
    //     const categoryResult = await CategoryServices.getById(data.categoryId);

    //     if (categoryResult) {
    //         setCategoryData(categoryResult);
    //         console.log('category', categoryResult)
    //     }
    // }

    const loadData = async () => {
        const result = await PropertyServices.getById(Number(id));

        if (result) {
            setData(result);
            const categoryId = result.categoryId;
            if (categoryId) {
                const categoryResult = await CategoryServices.getById(categoryId);
                if (categoryResult) {
                    setCategoryData(categoryResult);
                    console.log("Fetched category:", categoryResult);
                }
            }

            setIsLoading(false);
            const successMessage = `Successfully Fetch the Property record.`;
            console.log(successMessage);
        } else {
            const errorMessage = `Failed to get Property record. ${result.errorMessage}`;
            console.log(errorMessage)
            setIsLoading(true);
        }
    };

    useEffect(() => {
        if (id) {
            loadData();
        }
    }, []);

    const getCategoryName = (categoryId: number | undefined) => {
        return categoryData.id === categoryId ? categoryData.name : '';
    }

    const propertiesCategory = (row: any) => {
    return `${getCategoryName(row.categoryId)}`;
  };

    if (isLoading) {
        return (
            <>
            Loading....
            </>
        )
    }

    return (
        <>
            <div className="space-y-4">
                <div>
                    This is the Gallery
                </div>

                <div>
                    <h1 className="text-xl font-semibold">{data.listingName}</h1>
                    <div className="font-medium text-base text-gray-400">{propertiesCategory(data)}</div>
                </div>
            </div>
        </>
    )
}
