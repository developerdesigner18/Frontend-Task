export default function Loading() {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Loading...</p>
            </div>
        </div>
    );
}
