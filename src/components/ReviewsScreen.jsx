import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  TouchableOpacity,
  TextInput,
  Keyboard,
  ScrollView as RNScrollView,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppModal from "./AppModal";

const MAX_CHARS = 500;

const reviewsData = [
  {
    id: "1",
    user: "Lokesh Naidu",
    rating: 5,
    date: "04 Apr 2024",
    comment:
      "The bus was very clean and the staff was very professional. Highly recommend!",
    tags: ["Cleanliness", "Staff Behavior"],
    helpfulCount: 12,
  },
  {
    id: "2",
    user: "Prathyusha",
    rating: 4,
    date: "02 Apr 2024",
    comment: "Punctual departure and arrival. Seat was comfortable.",
    tags: ["Punctuality", "Seat Comfort"],
    helpfulCount: 5,
  },
  {
    id: "3",
    user: "Suresh Raina",
    rating: 5,
    date: "28 Mar 2024",
    comment: "Great experience. AC was working perfectly.",
    tags: ["AC", "Driving"],
    helpfulCount: 8,
  },
  {
    id: "4",
    user: "Ananya",
    rating: 3,
    date: "25 Mar 2024",
    comment:
      "Bus was delayed by 30 mins, but otherwise the journey was smooth.",
    tags: ["Driving"],
    helpfulCount: 2,
  },
];

export default function ReviewsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { busName, userName = "You" } = route.params || {};
  const insets = useSafeAreaInsets();

  const [reviews, setReviews] = useState([]);
  const [helpfulVotes, setHelpfulVotes] = useState({});
  const [reportedReviews, setReportedReviews] = useState({});
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [showSortModal, setShowSortModal] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [reviewToReport, setReviewToReport] = useState(null);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const flatListRef = useRef(null);

  // Load reviews from Storage
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const [storedReviews, storedVotes, storedReports] = await Promise.all([
          AsyncStorage.getItem(`reviews_${busName || "default"}`),
          AsyncStorage.getItem(`helpful_votes_${busName || "default"}`),
          AsyncStorage.getItem(`reported_reviews_${busName || "default"}`),
        ]);

        if (storedReviews) {
          setReviews(JSON.parse(storedReviews));
        } else {
          setReviews(reviewsData); // Default data if none exists
        }

        if (storedVotes) {
          setHelpfulVotes(JSON.parse(storedVotes));
        }

        if (storedReports) {
          setReportedReviews(JSON.parse(storedReports));
        }
      } catch (e) {
        setReviews(reviewsData);
      }
    };
    loadReviews();
  }, [busName]);

  // Calculate dynamic stats
  const stats = useMemo(() => {
    if (reviews.length === 0) return { avg: 0, count: 0 };
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);

    // Calculate distribution for the progress bars
    const distribution = [5, 4, 3, 2, 1].map((star) => {
      const count = reviews.filter((r) => r.rating === star).length;
      return {
        star,
        count,
        percentage: reviews.length > 0 ? (count / reviews.length) * 100 : 0,
      };
    });

    return {
      avg: (sum / reviews.length).toFixed(1),
      count: reviews.length,
      distribution,
    };
  }, [reviews]);

  const processedReviews = useMemo(() => {
    const filtered = reviews.filter((r) => {
      if (reportedReviews[r.id]) return false;
      const matchesFilter = filter === "All" || r.rating === filter;
      const matchesSearch = r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            r.user.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "Newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "Oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === "Highest Rated") {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return new Date(b.date).getTime() - new Date(a.date).getTime(); // Tie-break with date
      }
      return 0;
    });
  }, [reviews, filter, searchQuery, sortBy]);

  const handleToggleHelpful = async (reviewId) => {
    const isAlreadyHelpful = helpfulVotes[reviewId];

    const updatedReviews = reviews.map((r) => {
      if (r.id === reviewId) {
        const count = r.helpfulCount || 0;
        return {
          ...r,
          helpfulCount: isAlreadyHelpful ? Math.max(0, count - 1) : count + 1,
        };
      }
      return r;
    });

    const updatedVotes = { ...helpfulVotes };
    if (isAlreadyHelpful) {
      delete updatedVotes[reviewId];
    } else {
      updatedVotes[reviewId] = true;
    }

    setReviews(updatedReviews);
    setHelpfulVotes(updatedVotes);

    try {
      await AsyncStorage.setItem(`reviews_${busName || "default"}`, JSON.stringify(updatedReviews));
      await AsyncStorage.setItem(`helpful_votes_${busName || "default"}`, JSON.stringify(updatedVotes));
    } catch (e) {
      console.error("Failed to save helpful status", e);
    }
  };

  const handleEditPress = (review) => {
    setEditingReviewId(review.id);
    setNewRating(review.rating);
    setNewComment(review.comment);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const handleDeletePress = (reviewId) => {
    setReviewToDelete(reviewId);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) return;
    const updatedReviews = reviews.filter((r) => r.id !== reviewToDelete);
    
    try {
      await AsyncStorage.setItem(`reviews_${busName || "default"}`, JSON.stringify(updatedReviews));
      setReviews(updatedReviews);
    } catch (e) {
      console.error("Failed to delete review", e);
    } finally {
      setDeleteModalVisible(false);
      setReviewToDelete(null);
    }
  };

  const handleReportPress = (reviewId) => {
    setReviewToReport(reviewId);
    setReportModalVisible(true);
  };

  const confirmReport = async () => {
    if (!reviewToReport) return;

    const updatedReports = { ...reportedReviews, [reviewToReport]: true };
    setReportedReviews(updatedReports);

    try {
      await AsyncStorage.setItem(`reported_reviews_${busName || "default"}`, JSON.stringify(updatedReports));
    } catch (e) {
      console.error("Failed to save report", e);
    }

    setReportModalVisible(false);
    setReviewToReport(null);
  };

  const handleSubmitReview = async () => {
    if (newRating === 0) return alert("Please select a star rating");
    if (!newComment.trim()) return alert("Please write a short comment");

    setIsSubmitting(true);
    
    let updatedReviews;
    if (editingReviewId) {
      updatedReviews = reviews.map((r) =>
        r.id === editingReviewId
          ? { ...r, rating: newRating, comment: newComment.trim() }
          : r
      );
    } else {
      const newReview = {
        id: Date.now().toString(),
        user: userName,
        rating: newRating,
        date: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        comment: newComment.trim(),
        tags: ["Verified Trip"],
        helpfulCount: 0,
      };
      updatedReviews = [newReview, ...reviews];
    }

    try {
      await AsyncStorage.setItem(
        `reviews_${busName || "default"}`,
        JSON.stringify(updatedReviews),
      );
      setReviews(updatedReviews);
      setSuccessMessage(editingReviewId ? "Your review has been updated successfully!" : "Your review has been posted successfully!");
      setSuccessModalVisible(true);
      setEditingReviewId(null);
      setNewRating(0);
      setNewComment("");
      Keyboard.dismiss();
    } catch (e) {
      alert("Failed to save review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarSelector = () => (
    <View style={styles.starSelector}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => setNewRating(star)}>
          <FontAwesome
            name={star <= newRating ? "star" : "star-o"}
            size={28}
            color={star <= newRating ? "#FFD700" : "#CCC"}
            style={{ marginHorizontal: 4 }}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderReview = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.user.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{item.user}</Text>
            <Text style={styles.reviewDate}>{item.date}</Text>
          </View>
        </View>
        <View style={styles.reviewHeaderRight}>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{item.rating} ★</Text>
          </View>
          {item.user === userName ? (
            <View style={styles.ownReviewActions}>
              <TouchableOpacity onPress={() => handleEditPress(item)} style={styles.actionBtn}>
                <MaterialIcons name="edit" size={18} color="#2F80ED" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeletePress(item.id)} style={styles.actionBtn}>
                <MaterialIcons name="delete-outline" size={18} color="#D32F2F" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => handleReportPress(item.id)} style={styles.reportBtn}>
              <MaterialIcons name="flag" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <Text style={styles.comment}>{item.comment}</Text>
      <View style={styles.reviewFooter}>
        <View style={styles.tagContainer}>
          {item.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.helpfulBtn, helpfulVotes[item.id] && styles.helpfulBtnActive]}
          onPress={() => handleToggleHelpful(item.id)}
        >
          <MaterialIcons
            name={helpfulVotes[item.id] ? "thumb-up" : "thumb-up-off-alt"}
            size={16}
            color={helpfulVotes[item.id] ? "#2F80ED" : "#666"}
          />
          <Text style={[styles.helpfulText, helpfulVotes[item.id] && styles.helpfulTextActive]}>
            Helpful {item.helpfulCount > 0 ? `(${item.helpfulCount})` : ""}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Ratings & Reviews</Text>
          <Text style={styles.busName}>{busName || "Bus Details"}</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={processedReviews}
        keyExtractor={(item) => item.id}
        renderItem={renderReview}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="rate-review" size={48} color="#CCC" />
            <Text style={styles.emptyText}>
              {searchQuery 
                ? `No reviews matching "${searchQuery}"`
                : `No ${filter === "All" ? "" : `${filter} star`} reviews yet.`}
            </Text>
          </View>
        )}
        ListHeaderComponent={() => (
          <View>
            <View style={styles.summarySection}>
              <View style={styles.summaryTop}>
                <View style={styles.ratingMain}>
                  <Text style={styles.ratingBig}>{stats.avg}</Text>
                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <FontAwesome
                        key={s}
                        name="star"
                        size={14}
                        color={s <= Math.round(stats.avg) ? "#388E3C" : "#DDD"}
                        style={{ marginRight: 2 }}
                      />
                    ))}
                  </View>
                  <Text style={styles.reviewCount}>{stats.count} ratings</Text>
                </View>

                <View style={styles.distributionContainer}>
                  {stats.distribution?.map((item) => (
                    <View key={item.star} style={styles.distRow}>
                      <Text style={styles.distStarText}>{item.star} ★</Text>
                      <View style={styles.distBarBg}>
                        <View
                          style={[
                            styles.distBarFill,
                            { width: `${item.percentage}%` },
                          ]}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              <RNScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterBar}
                contentContainerStyle={{ paddingHorizontal: 20 }}
              >
                {["All", 5, 4, 3, 2, 1].map((f) => (
                  <TouchableOpacity
                    key={f}
                    style={[
                      styles.filterChip,
                      filter === f && styles.activeFilterChip,
                    ]}
                    onPress={() => setFilter(f)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        filter === f && styles.activeFilterChipText,
                      ]}
                    >
                      {f === "All" ? "All Reviews" : `${f} Star`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </RNScrollView>

              <View style={styles.searchBar}>
                <MaterialIcons name="search" size={20} color="#999" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search reviews..."
                  placeholderTextColor="#999"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery !== "" && (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <MaterialIcons name="close" size={20} color="#999" />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.sortRow}>
                <Text style={styles.resultsCount}>
                  {processedReviews.length} {processedReviews.length === 1 ? 'review' : 'reviews'}
                </Text>
                <TouchableOpacity 
                  style={styles.sortTrigger} 
                  onPress={() => setShowSortModal(true)}
                >
                  <MaterialIcons name="sort" size={18} color="#2F80ED" />
                  <Text style={styles.sortTriggerText}>Sort: {sortBy}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputSection}>
              <View style={styles.rowBetween}>
                <Text style={styles.inputTitle}>
                  {editingReviewId ? "Edit your review" : "Rate your experience"}
                </Text>
                {editingReviewId && (
                  <TouchableOpacity onPress={() => {
                    setEditingReviewId(null);
                    setNewRating(0);
                    setNewComment("");
                  }}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                )}
              </View>
              <StarSelector />
              <TextInput
                style={styles.textInput}
                placeholder="Write your feedback here..."
                placeholderTextColor="#999"
                multiline
                value={newComment}
                onChangeText={setNewComment}
                maxLength={MAX_CHARS}
              />
              <Text style={[styles.charCounter, newComment.length >= MAX_CHARS && styles.charLimitReached]}>
                {newComment.length}/{MAX_CHARS}
              </Text>
              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  (isSubmitting || !newRating) && styles.submitBtnDisabled,
                ]}
                onPress={handleSubmitReview}
                disabled={isSubmitting || !newRating}
              >
                <Text style={styles.submitBtnText}>
                  {isSubmitting ? "Submitting..." : editingReviewId ? "Update Review" : "Post Review"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal transparent visible={showSortModal} animationType="fade" onRequestClose={() => setShowSortModal(false)}>
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowSortModal(false)}
        >
          <View style={styles.sortModalContent}>
            <Text style={styles.sortModalTitle}>Sort Reviews By</Text>
            {["Newest", "Oldest", "Highest Rated"].map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.sortOption}
                onPress={() => {
                  setSortBy(option);
                  setShowSortModal(false);
                }}
              >
                <Text style={[styles.sortOptionText, sortBy === option && styles.activeSortOptionText]}>{option}</Text>
                {sortBy === option && <MaterialIcons name="check" size={20} color="#2F80ED" />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <AppModal
        visible={reportModalVisible}
        title="Report Review"
        message="Are you sure you want to report this review as inappropriate? It will be hidden from your view."
        type="error"
        showCancel={true}
        confirmText="Report"
        onConfirm={confirmReport}
        onCancel={() => setReportModalVisible(false)}
      />

      <AppModal
        visible={deleteModalVisible}
        title="Delete Review"
        message="Are you sure you want to permanently delete your review?"
        type="error"
        showCancel={true}
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
      />

      <AppModal
        visible={successModalVisible}
        title="Success!"
        message={successMessage}
        type="success"
        confirmText="Awesome"
        onConfirm={() => setSuccessModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#fff",
    elevation: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  backBtn: { marginRight: 16 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#333" },
  busName: { fontSize: 13, color: "#666" },
  listContent: { paddingBottom: 40 },
  summarySection: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    marginBottom: 8,
  },
  summaryTop: {
    flexDirection: "row",
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  ratingMain: { alignItems: "center" },
  ratingBig: { fontSize: 40, fontWeight: "bold", color: "#333" },
  starsRow: { flexDirection: "row", marginVertical: 4 },
  reviewCount: { fontSize: 12, color: "#777" },
  distributionContainer: { flex: 1, marginLeft: 30 },
  distRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  distStarText: { fontSize: 11, color: "#666", width: 25 },
  distBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: "#F0F0F0",
    borderRadius: 3,
    overflow: "hidden",
  },
  distBarFill: { height: "100%", backgroundColor: "#388E3C" },
  filterBar: { borderTopWidth: 1, borderTopColor: "#F5F5F5", paddingTop: 15 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  activeFilterChip: { backgroundColor: "#2F80ED", borderColor: "#2F80ED" },
  filterChipText: { fontSize: 13, color: "#666", fontWeight: "500" },
  activeFilterChipText: { color: "#fff" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    marginHorizontal: 20,
    marginTop: 15,
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  sortRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 15,
  },
  resultsCount: { fontSize: 13, color: "#666", fontWeight: "500" },
  sortTrigger: { flexDirection: "row", alignItems: "center", backgroundColor: "#EBF3FF", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  sortTriggerText: { fontSize: 13, color: "#2F80ED", fontWeight: "600", marginLeft: 4 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  sortModalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 340,
  },
  sortModalTitle: { fontSize: 18, fontWeight: "700", color: "#333", marginBottom: 20 },
  sortOption: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#F5F5F5" },
  sortOptionText: { fontSize: 16, color: "#555" },
  activeSortOptionText: { color: "#2F80ED", fontWeight: "600" },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  reviewCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  reviewHeaderRight: { flexDirection: "row", alignItems: "center" },
  ownReviewActions: { flexDirection: "row", alignItems: "center" },
  actionBtn: { marginLeft: 12, padding: 4 },
  reportBtn: { marginLeft: 12, padding: 4 },
  userInfo: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: { color: "#2196F3", fontWeight: "bold", fontSize: 18 },
  userName: { fontSize: 15, fontWeight: "600", color: "#333" },
  reviewDate: { fontSize: 12, color: "#999", marginTop: 2 },
  ratingBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: { color: "#2E7D32", fontSize: 12, fontWeight: "bold" },
  comment: { fontSize: 14, color: "#444", lineHeight: 20, marginBottom: 12 },
  reviewFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  tagContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8, flex: 1 },
  tag: {
    backgroundColor: "#F1F8F4",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#C8E6C9",
  },
  tagText: { color: "#2E7D32", fontSize: 11, fontWeight: "500" },
  helpfulBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#EEE",
    marginLeft: 10,
  },
  helpfulBtnActive: {
    backgroundColor: "#EBF3FF",
    borderColor: "#2F80ED",
  },
  helpfulText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 6,
    fontWeight: "500",
  },
  helpfulTextActive: {
    color: "#2F80ED",
  },
  inputSection: {
    backgroundColor: "#fff",
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 16,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#2F80ED",
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cancelText: { color: "#D32F2F", fontWeight: "600", fontSize: 13, marginBottom: 15 },
  charCounter: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 4,
  },
  charLimitReached: { color: "#D32F2F" },
  starSelector: { flexDirection: "row", marginBottom: 15 },
  textInput: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    height: 80,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 14,
    color: "#333",
  },
  submitBtn: {
    backgroundColor: "#2F80ED",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  submitBtnDisabled: { backgroundColor: "#E5E7EB" },
  submitBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  emptyContainer: { alignItems: "center", marginTop: 40 },
  emptyText: { color: "#999", fontSize: 14, marginTop: 10 },
});
