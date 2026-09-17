import java.util.*;

public class Output1 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int t = sc.nextInt();
        int[] num = new int[t];

        for (int i = 0; i < t; i++) {

            int n = sc.nextInt();
            int[] arr = new int[n];

            for (int l = 0; l < n; l++) {
                arr[l] = sc.nextInt();
            }

            // Perform swapping only if index is valid
            for (int k = 0; k < n; k++) {
                if (2 * k < n) {
                    int temp = arr[k];
                    arr[k] = arr[2 * k];
                    arr[2 * k] = temp;
                }
            }

            // Check if array is sorted
            int[] copy = arr.clone();
            Arrays.sort(copy);

            boolean sorted = true;
            for (int j = 0; j < n; j++) {
                if (arr[j] != copy[j]) {
                    sorted = false;
                    break;
                }
            }

            if (sorted)
                num[i] = 1;
            else
                num[i] = 0;
        }

        for (int i = 0; i < t; i++) {
            if (num[i] == 1)
                System.out.println("YES");
            else
                System.out.println("NO");
        }
    }
}
