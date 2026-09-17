import java.util.*;

public class Output{
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int t = sc.nextInt();
        int[] num = new int[t];

        for(int i = 0; i < t; i++){

            int n = sc.nextInt();
            int[] arr = new int[n];

            for(int l = 0; l < n; l++){
                arr[l] = sc.nextInt();
            }

            num[i] = 0;

            for(int k = 0; k < n; k++){
                if(arr[k] == 67){
                    num[i] = 1;
                    break;
                }
            }
        }

        for(int i = 0; i < t; i++){
            if(num[i] == 1)
                System.out.println("YES");
            else
                System.out.println("NO");
        }
    }
}
