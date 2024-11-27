import React, { useState } from "react"; 
import SidebarAdmin from "../components/SidebarAdmin";
import Footer from "../components/Footer";
import PaginationAdmin from "../components/PaginationAdmin";
import FilterAdmin from "../components/FilterAdmin";
import "../css/style.css";
import { useQuery, useMutation, useQueryClient } from "react-query";
import commentDataService from "../services/comment.service";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const CmsComment = () => {
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const queryClient = useQueryClient();
    const [filterStatus, setFilterStatus] = useState("NONE");
    const [numberOfShows, setNumberOfShows] = useState(10);

    const toggleSidebar = () => setSidebarVisible(!isSidebarVisible);

    // Fetch comments with pagination
    const { data, isLoading, error } = useQuery(
        ["comments", currentPage, filterStatus, numberOfShows, currentPage],
        async () => {
            if (filterStatus !== "NONE") {
                const response = await commentDataService.filterApprovalStatus(filterStatus, currentPage, numberOfShows);
                return response.data;
                
            } else {
                const response = await commentDataService.getPaginatedComments(currentPage, numberOfShows);
                return response.data;
            }
                
        } 
    );

    console.log("data: ", data?.data);

    const totalEntries = data?.totalEntries || 0;

    const approveMutation = useMutation(
        (commentId) => commentDataService.updateStatus(commentId, { approval_status: "APPROVED" }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries("comments");
                setModalVisible(false);
                setSelectedCommentId(null);
            },
        }
    );

    const handleApproveClick = (commentId) => {
        setSelectedCommentId(commentId);
        setModalVisible(true);
    };

    const confirmApprove = () => {
        if (selectedCommentId) {
            approveMutation.mutate(selectedCommentId);
        }
    };

    const handlePageChange = (newPage) => setCurrentPage(newPage);

    const toggleSelectAll = () => {
        setIsAllSelected(!isAllSelected);
        setSelectedIds(isAllSelected ? [] : data.data.data.map((comment) => comment.comment_id));
    };

    const toggleSelect = (commentId) => {
        setSelectedIds((prevSelectedIds) =>
            prevSelectedIds.includes(commentId)
                ? prevSelectedIds.filter((id) => id !== commentId)
                : [...prevSelectedIds, commentId]
        );
    };

    if (isLoading) return <div>Loading comments...</div>;
    if (error) return <div>Error fetching comments: {error.message}</div>;

    return (
        <div className="flex flex-col min-h-screen text-gray-300 bg-gray-900">
            <div className="flex flex-col flex-1 md:flex-row">
                <SidebarAdmin isVisible={isSidebarVisible} toggleSidebar={toggleSidebar} />

                <main className="flex-1 p-4 md:p-6">
                    <button
                        id="hamburger"
                        className="p-2 text-gray-400 md:hidden focus:outline-none"
                        onClick={toggleSidebar}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>

                    <section className="container p-4 mx-auto bg-gray-800 rounded-md shadow-md md:p-6">
                        <FilterAdmin 
                            onFilterStatusChange={setFilterStatus}
                            onNumberOfShowsChange={setNumberOfShows}
                        />
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-gray-300 bg-gray-800">
                                <thead>
                                    <tr className="bg-gray-700">
                                        <th className="px-4 py-2 text-left border-b border-gray-600">
                                            <input 
                                                type="checkbox" 
                                                checked={isAllSelected} 
                                                onChange={toggleSelectAll} 
                                            />
                                        </th>
                                        <th className="px-4 py-2 text-left border-b border-gray-600">Username</th>
                                        <th className="px-4 py-2 text-left border-b border-gray-600">Rate</th>
                                        <th className="px-4 py-2 text-left border-b border-gray-600">Title</th>
                                        <th className="px-4 py-2 text-left border-b border-gray-600">Comments</th>
                                        <th className="px-4 py-2 text-left border-b border-gray-600">Approval Status</th>
                                        <th className="px-4 py-2 text-left border-b border-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.data.map((comment) => (
                                        <tr key={comment.comment_id}>
                                            <td className="px-4 py-2 border-b border-gray-600">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedIds.includes(comment.comment_id)} 
                                                    onChange={() => toggleSelect(comment.comment_id)} 
                                                />
                                            </td>
                                            <td className="px-4 py-2 border-b border-gray-600">{comment.username}</td>
                                            <td className="px-4 py-2 border-b border-gray-600">{comment.comment_rate}</td>
                                            <td className="px-4 py-2 border-b border-gray-600">{comment.title}</td>
                                            <td className="px-4 py-2 border-b border-gray-600">{comment.detail_comment}</td>
                                            <td className="px-4 py-2 border-b border-gray-600">
                                                {comment.approval_status === "APPROVED" ? (
                                                    <span className="flex items-center px-2 py-1 text-green-500">
                                                        <FaCheckCircle className="mr-1" /> Approved
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center px-2 py-1 text-red-500">
                                                        <FaTimesCircle className="mr-1" /> UNAPPROVED
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 border-b border-gray-600">
                                                {comment.approval_status !== "APPROVED" && (
                                                    <button
                                                        className="px-2 py-1 text-white bg-orange-500 rounded hover:bg-orange-600"
                                                        onClick={() => handleApproveClick(comment.comment_id)}
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <PaginationAdmin
                            currentPage={currentPage}
                            totalEntries={totalEntries}
                            entriesPerPage={numberOfShows}
                            onPageChange={handlePageChange}
                        />

                        <div className="flex items-center mt-4 space-x-4">
                            <label 
                                className="font-semibold text-red-500 cursor-pointer" 
                                onClick={toggleSelectAll}
                            >
                                Select All
                            </label>
                        </div>
                    </section>
                </main>
            </div>

            <Footer />

            {modalVisible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="p-6 bg-gray-800 rounded-md">
                        <h2 className="mb-4 text-lg text-white">Confirm Approval</h2>
                        <p className="mb-4 text-gray-300">Are you sure you want to approve this comment?</p>
                        <div className="flex justify-end">
                            <button
                                className="px-4 py-2 mr-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                                onClick={() => setModalVisible(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                                onClick={confirmApprove}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CmsComment;
