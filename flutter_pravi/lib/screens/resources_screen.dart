import 'package:flutter/material.dart';

class ResourcesScreen extends StatefulWidget {
  const ResourcesScreen({super.key});

  @override
  State<ResourcesScreen> createState() => _ResourcesScreenState();
}

class _ResourcesScreenState extends State<ResourcesScreen> {
  String _selectedCategory = 'All';
  
  final List<String> categories = [
    'All',
    'Sensory',
    'Social',
    'Work',
    'Anxiety',
    'Focus',
  ];
  
  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Resources',
            style: textTheme.displayLarge,
          ),
          const SizedBox(height: 24),
          
          // Search bar
          Container(
            margin: const EdgeInsets.only(bottom: 16),
            decoration: BoxDecoration(
              color: Colors.grey[100],
              borderRadius: BorderRadius.circular(24),
            ),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Search resources',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(24),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
              ),
            ),
          ),
          
          // Category filter
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: categories.map((category) {
                final isSelected = _selectedCategory == category;
                return GestureDetector(
                  onTap: () {
                    setState(() {
                      _selectedCategory = category;
                    });
                  },
                  child: Container(
                    margin: const EdgeInsets.only(right: 12),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      color: isSelected ? colorScheme.primary : Colors.transparent,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: isSelected ? colorScheme.primary : Colors.grey[300]!,
                      ),
                    ),
                    child: Text(
                      category,
                      style: TextStyle(
                        color: isSelected ? Colors.white : Colors.grey[700],
                        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
          
          const SizedBox(height: 24),
          
          // Featured resources
          _buildSectionHeader('Featured Resources'),
          const SizedBox(height: 16),
          _buildFeaturedResources(),
          
          const SizedBox(height: 24),
          
          // All resources
          _buildSectionHeader('All Resources'),
          const SizedBox(height: 16),
          _buildResourcesList(),
        ],
      ),
    );
  }
  
  Widget _buildSectionHeader(String title) {
    return Text(
      title,
      style: Theme.of(context).textTheme.displayMedium?.copyWith(
        fontWeight: FontWeight.bold,
      ),
    );
  }
  
  Widget _buildFeaturedResources() {
    final colorScheme = Theme.of(context).colorScheme;
    
    // Sample featured resources
    final List<Map<String, dynamic>> featuredResources = [
      {
        'title': 'Managing Sensory Overload',
        'description': 'Learn effective techniques to handle sensory sensitivities in daily situations.',
        'type': 'Guide',
        'tags': ['Sensory', 'Anxiety'],
        'color': colorScheme.primary,
      },
      {
        'title': 'Workplace Communication Strategies',
        'description': 'Practical tips for effective communication in professional settings.',
        'type': 'Video Series',
        'tags': ['Work', 'Social'],
        'color': colorScheme.secondary,
      },
    ];
    
    return SizedBox(
      height: 220,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: featuredResources.length,
        itemBuilder: (context, index) {
          final resource = featuredResources[index];
          return Container(
            width: 280,
            margin: const EdgeInsets.only(right: 16),
            child: Card(
              elevation: 3,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  gradient: LinearGradient(
                    colors: [
                      resource['color'],
                      resource['color'].withOpacity(0.7),
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.3),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          resource['type'],
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        resource['title'],
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        resource['description'],
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 14,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const Spacer(),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Wrap(
                            spacing: 8,
                            children: (resource['tags'] as List).map((tag) {
                              return Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 8,
                                  vertical: 4,
                                ),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.3),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Text(
                                  tag,
                                  style: const TextStyle(
                                    fontSize: 12,
                                    color: Colors.white,
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              shape: BoxShape.circle,
                            ),
                            child: Icon(
                              Icons.arrow_forward,
                              color: resource['color'],
                              size: 20,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
  
  Widget _buildResourcesList() {
    final colorScheme = Theme.of(context).colorScheme;
    
    // Sample resources data
    final List<Map<String, dynamic>> resources = [
      {
        'title': 'Coping with Sensory Overload',
        'type': 'Article',
        'source': 'Neurodiversity Foundation',
        'tags': ['Sensory', 'Anxiety'],
      },
      {
        'title': 'Effective Communication Strategies',
        'type': 'Video',
        'source': 'Social Skills Academy',
        'tags': ['Social', 'Work'],
      },
      {
        'title': 'Organizing Your Workspace',
        'type': 'Guide',
        'source': 'Executive Function Hub',
        'tags': ['Work', 'Focus'],
      },
      {
        'title': 'Mindfulness for Anxiety',
        'type': 'Audio',
        'source': 'Wellness Institute',
        'tags': ['Anxiety', 'Focus'],
      },
      {
        'title': 'Navigating Social Gatherings',
        'type': 'Checklist',
        'source': 'Social Support Network',
        'tags': ['Social', 'Anxiety'],
      },
    ];
    
    // Filter resources based on selected category
    final filteredResources = _selectedCategory == 'All'
        ? resources
        : resources.where((resource) => 
            (resource['tags'] as List).contains(_selectedCategory)).toList();
    
    return Column(
      children: filteredResources.map((resource) {
        return Card(
          elevation: 2,
          margin: const EdgeInsets.only(bottom: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          child: ListTile(
            contentPadding: const EdgeInsets.all(16),
            leading: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: colorScheme.primary.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: _getIconForResourceType(resource['type']),
            ),
            title: Text(
              resource['title'],
              style: const TextStyle(
                fontWeight: FontWeight.bold,
              ),
            ),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 8),
                Row(
                  children: [
                    Text(
                      resource['type'],
                      style: TextStyle(
                        color: colorScheme.primary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'by ${resource['source']}',
                      style: TextStyle(
                        color: Colors.grey[600],
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  children: (resource['tags'] as List).map((tag) {
                    return Chip(
                      label: Text(
                        tag,
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.white,
                        ),
                      ),
                      backgroundColor: colorScheme.secondary,
                      padding: const EdgeInsets.all(2),
                    );
                  }).toList(),
                ),
              ],
            ),
            trailing: const Icon(Icons.arrow_forward_ios, size: 16),
            onTap: () {},
          ),
        );
      }).toList(),
    );
  }
  
  Widget _getIconForResourceType(String type) {
    final Map<String, IconData> typeIcons = {
      'Article': Icons.article,
      'Video': Icons.video_library,
      'Guide': Icons.menu_book,
      'Audio': Icons.headphones,
      'Checklist': Icons.checklist,
    };
    
    return Icon(
      typeIcons[type] ?? Icons.article,
      color: Theme.of(context).colorScheme.primary,
    );
  }
}