export default function Pagination({
	prev_page_url,
	next_page_url,
	current_page_num,
	last_page_num,
	onChangePage,
}) {
	function handlePrevious() {
		if (prev_page_url === null) return
		const searchParams = new URLSearchParams(new URL(prev_page_url).search)
		onChangePage(searchParams.get("page"))
	}

	function handleNext() {
		if (next_page_url === null) return
		const searchParams = new URLSearchParams(new URL(next_page_url).search)
		onChangePage(searchParams.get("page"))
	}
	return (
		<div className="flex justify-center my-6 px-3">
			<div
				className={`rounded-full w-32 h-10 inline-flex justify-center items-center cursor-pointer select-none ${
					prev_page_url ? "bg-gray-100" : "bg-gray-300"
				}`}
				onClick={handlePrevious}
			>
				<span>&#171;</span>
			</div>
			<div className="w-20 h-10 inline-flex justify-center items-center">
				{current_page_num}/{last_page_num}
			</div>
			<div
				className={`rounded-full w-32 h-10 inline-flex justify-center items-center cursor-pointer select-none ${
					next_page_url ? "bg-gray-100" : "bg-gray-300"
				}`}
				onClick={handleNext}
			>
				&#187;
			</div>
		</div>
	)
}